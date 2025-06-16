import {CoreSocketService, SocketController, SocketPayload} from "@azur-games/pixi-vip-framework";
import {DominoGame} from "../app";
import {ActiveData} from "../data/ActiveData";
import {ScreenType} from "../domino_game/root/screens/ScreenType";
import {DominoItem} from "../domino_game/root/screens/table_screen/domino_logic/DominoItem";
import {IPossibleMoveData} from "../dynamic_data/IPossibleMoveData";
import {SitPlace} from "../dynamic_data/SitPlace";
import {SocketGameRequest} from "../dynamic_data/SocketGameRequest";
import {SocketGameRequestState} from "../dynamic_data/SocketGameRequestState";
import {WebSocketMessageType} from "../dynamic_data/WebSocketMessageType";
import {DynamicData} from "../DynamicData";
import {GameEvents} from "../GameEvents";
import {Settings} from "../Settings";
import {StringUtils} from "@azur-games/pixi-vip-framework";
import {ChatMessagesService} from "./ChatMessagesService";
import {LocalStorageService} from "@azur-games/pixi-vip-framework";
import {FacebookTransaction} from "@azur-games/pixi-vip-framework";
import {SettingsService} from "./SettingsService";
import {AuthNetworkType} from "./socket_service/AuthNetworkType";
import {AuthResponse} from "./socket_service/AuthResponse";
import {FriendData} from "./socket_service/socket_message_data/FriendData";
import {FullProfileData} from "./socket_service/socket_message_data/profile_data/FullProfileData";
import {ProfileData} from "./socket_service/socket_message_data/ProfileData";
import {GameMode} from "./socket_service/socket_message_data/socket_game_config/GameMode";
import {GameType} from "./socket_service/socket_message_data/socket_game_config/GameType";
import {ChatEventMessage} from "./socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {UserEventMessage} from "./socket_service/socket_message_data/UserEventMessage";
import {UserMessagesStatusById} from "./socket_service/socket_message_data/UserMessagesStatusById";
import {WheelSector} from "./socket_service/socket_message_data/wheel_config/WheelSector";
import {WheelConfig} from "./socket_service/socket_message_data/WheelConfig";
import {SocketMessageData} from "./socket_service/SocketMessageData";
import {SocketMessageType} from "./socket_service/SocketMessageType";
import {UserOnlineStatus} from "./socket_service/UserOnlineStatus";
import {UserEventsService} from "./UserEventsService";
import {XsollaInitResponse} from "@azur-games/pixi-vip-framework";


export class SocketService extends CoreSocketService {
    static leaveGameWhileDisconnected: boolean;
    static roomRepeating: boolean;
    private static reconnectMove: IPossibleMoveData;
    static wasDisconnected: boolean = false;

    static clientInit(): void {
        addEventListener(GameEvents.ON_SOCKET_MESSAGE, SocketService.onSocketMessage);
        addEventListener(GameEvents.SOCKET_CLOSE, SocketService.onSocketClose);
        addEventListener(GameEvents.LEAVE_GAME, () => SocketService.leaveGame(true));
    }

    static onSocketClose() {
        ActiveData.gameStateData = null;
        DynamicData.socketGameState = null;
    }

    static get afterReconnect(): boolean {
        return SocketService.reconnectTime + 1000 > Date.now();
    }

    static async onSocketMessage(event: MessageEvent): Promise<void> {
        let messageType: SocketMessageType = event.data.type;
        let messageData: SocketMessageData = event.data.data;
        let messagePlace: SitPlace = event.data.place;
        //document.getElementById("debug").append("messageType:", messageType+" | ");
        switch (messageType) {
            case SocketMessageType.GAME_REQUEST:
                DynamicData.socketGameRequest = messageData as SocketGameRequest;
                SocketController.dataReady && await DominoGame.instance.root.screens.gameSync(DynamicData.socketGameRequest);
                break;
            case SocketMessageType.STATE:
            case SocketMessageType.PHRASE:
            case SocketMessageType.GAME_MESSAGE:
                SocketService.checkLeftWithoutDisconnected();
                dispatchEvent(new MessageEvent(GameEvents.GAME_STATE_UPDATE, {
                    data: {
                        messageType,
                        messageData,
                        messagePlace,
                        fast: false
                    }
                }));
                break;
            case SocketMessageType.FRIENDS:
                DynamicData.myFriends = messageData as FriendData[];
                dispatchEvent(new MessageEvent(GameEvents.ON_FRIENDS_CHANGE));
                break;
            case SocketMessageType.FRIEND_REMOVED:
                let removedFriend: FriendData = messageData as FriendData;
                DynamicData.myFriends = DynamicData.myFriends.filter(friend => friend.id !== removedFriend.id);
                dispatchEvent(new MessageEvent(GameEvents.ON_FRIENDS_CHANGE));
                break;
            case SocketMessageType.PROFILE:
                DynamicData.myProfile = messageData as ProfileData;
                dispatchEvent(new MessageEvent(GameEvents.PROFILE_UPDATED));
                break;
            case SocketMessageType.WHEEL:
                DynamicData.wheel = messageData as WheelConfig;
                DynamicData.wheelResponseTime = Date.now();
                dispatchEvent(new MessageEvent(GameEvents.WHEEL_UPDATED));
                break;
            case SocketMessageType.MESSAGES:
                DynamicData.userEventsMessages = messageData as UserEventMessage[];
                break;
            case SocketMessageType.MESSAGE:
                DynamicData.userEventsMessages.push(messageData as UserEventMessage);
                UserEventsService.handleMessage(messageData as UserEventMessage);
                break;
            case SocketMessageType.USER_MESSAGES_STATUS:
                ChatMessagesService.setStatuses(messageData as UserMessagesStatusById);
                break;
        }

        SocketController.checkDataReady(messageType);
    }

    static setPlayerIcon(icon: string): Promise<void> {
        return new Promise(resolve => SocketService.mainConnection.send("profileSetIcon", [icon], resolve));
    }

    static setPlayerName(name: string, addNumberIfExist: boolean = false): Promise<ProfileData> {
        if (name == DynamicData.myProfile.name) {
            return;
        }
        return new Promise((resolve, reject) => SocketService.mainConnection.send("profileSetName", [name, addNumberIfExist], (error: any, data: any) => {
            error ? reject(error) : resolve(data);
        }));
    }

    static async platformSignIn(network: AuthNetworkType, data: any): Promise<AuthResponse> {
        return new Promise(resolve => SocketService.mainConnection.send("loginGameServices", [network, data], (error: any, data: any) => {
            error;
            console.log("auth error --> ", error);
            console.log("auth data --> ", data);
            resolve(data);
        }));
    }

    static async createGameRequest(type: GameType, mode: GameMode) {
        SocketService.mainConnection.send("createGameRequest", [{type, mode}], (answer: any) => {
            console.log("game request answer", answer);
        });
    }

    static async move(possibleMove: IPossibleMoveData): Promise<void> {
        SocketService.gameConnection.send("move", [possibleMove], (answer: any) => {
            //console.log("move answer", answer);
        });
    }

    static noAfk(): void {
        SocketService.gameConnection.send("notAfk", []);
    }

    static async cancelGameRequest() {
        if (SocketService.mainConnection.connectionSent) {
            SocketService.mainConnection.send(WebSocketMessageType.CANCEL_GAME_REQUEST, []);
            DynamicData.socketGameRequest = null;
            SocketService.gameConnection.connected && SocketService.closeGameConnection();
        } else {
            await LocalStorageService.setKeyValue(Settings.LEFT_WHILE_DISCONNECTED, SocketService.leaveGameWhileDisconnected = true);
        }
    }

    static findProfilesByNamePart(name: string): Promise<ProfileData[]> {
        return new Promise(resolve => SocketService.mainConnection.send("profileFindByNameILike", [name + "%", 1], (error: any, data: any) => {
            resolve(data);
        }));
    };

    static createFriend(id: number): Promise<boolean> {
        return new Promise(resolve => SocketService.mainConnection.send("createFriend", [id], (error: any, data: boolean) => {
            resolve(data);
        }));
    }

    static createFbFriends(friends: {id: string}[]): Promise<FriendData[]> {
        return new Promise(resolve => SocketService.mainConnection.send("createFbFriends", [friends], (error: any, data: FriendData[]) => {
            resolve(data);
        }));
    }

    static removeFriend(id: number): void {
        SocketService.mainConnection.send("removeFriend", [id]);
    }

    static getPlayerProfileData(playerId: number): Promise<FullProfileData> {
        return new Promise(resolve => SocketService.mainConnection.send("profileFindById", [playerId], (error: any, data: any) => {
            console.log("profileFindById", error);
            console.log("profileFindById", data);
            resolve(data);
        }));
    }

    static async leaveGame(closeGameConnection: boolean): Promise<void> {
        if (SocketService.mainConnection.connectionSent) {
            await new Promise<void>(resolve => {
                SocketService.gameConnection.send(WebSocketMessageType.LEAVE_GAME, [], () => {
                    console.log("leaveGameAnswer");
                    if (closeGameConnection) {
                        DynamicData.socketGameRequest = null;
                        SocketService.closeGameConnection();
                    }
                    resolve();
                });
            });
        } else {
            SocketService.cancelGameRequest();
            dispatchEvent(new MessageEvent(GameEvents.SCREEN_CHANGE, {data: {screen: ScreenType.LOBBY}}));
        }
    }

    static async wheelSpin(): Promise<WheelSector> {
        return new Promise(resolve => SocketService.mainConnection.send("wheelSpin", [StringUtils.formatTimeToISOStringWithTimezone(new Date())], (_error: any, data: any) => {
            resolve(data);
        }));
    };

    static async wheelReset(): Promise<void> {
        return new Promise(resolve => SocketService.mainConnection.send("wheelReset", [], resolve));
    }

    static async changeRole(): Promise<void> {
        return new Promise(resolve => SocketService.mainConnection.send("changeRole", ["test", "ahalai"], resolve));
    }

    static async tryLeave() {
        let request: SocketGameRequest = DynamicData.socketGameRequest;
        let state: SocketGameRequestState = request?.state;
        if (!state) {
            return;
        }
        switch (state) {
            case SocketGameRequestState.CREATED:
            case SocketGameRequestState.WON:
            case SocketGameRequestState.LOST:
                await SocketService.cancelGameRequest();
                break;
            case SocketGameRequestState.PREPARED:
            case SocketGameRequestState.LEAVING:
                return;
            default:
                request.mode == GameMode.PRO
                    ? SocketService.leaveGame(false)
                    : dispatchEvent(new MessageEvent(GameEvents.OPEN_LEAVE_GAME_POPUP));
        }
    }

    static closeGameConnection() {
        console.log("GK CLOSING");
        SocketService.gameConnection.close();
        ActiveData.gameStateData = null;
        DynamicData.socketGameState = null;
    }

    static async getOnlineStatus(id: number): Promise<UserOnlineStatus> {
        return new Promise(resolve => SocketService.mainConnection.send("onlineStatus", [id], (_error: any, data: UserOnlineStatus) => {
            resolve(data);
        }));
    }

    static async getUserMessages(userId: number): Promise<ChatEventMessage[]> {
        return new Promise(resolve => SocketService.mainConnection.send("getUserMessages", [userId], (_error: any, data: any) => {
            resolve(data);
        }));
    }

    static sendUserMessage(userId: number, message: string): Promise<null> {
        return new Promise(resolve => SocketService.mainConnection.send("sendUserMessage", [userId, message], resolve));
    };

    static viewMessage(messagesId: number[]): void {
        SocketService.mainConnection.send("viewMessages", [messagesId]);
        messagesId.forEach(msgId => {
            let message: UserEventMessage = DynamicData.userEventsMessages.find(msg => msg.id == msgId);
            message && (message.isNew = false);
        });
    }

    static async xsollaInitPayment(productId: string, tournamentId: number): Promise<XsollaInitResponse> {
        return new Promise(resolve => SocketService.mainConnection.send("xsollaInitPayment", [productId, tournamentId, SettingsService.currentLanguage], (_error: any, data: any) => {
            resolve(data);
        }));
    }

    static deleteAccount(millisecondsToDestroy: number): Promise<boolean> {
        return new Promise(resolve => SocketService.mainConnection.send("initDestroy", [millisecondsToDestroy], (error: any, _data: any) => {
            resolve(!error);
        }));
    }

    static sendGift(giftId: string, playerId: number) {
        SocketService.gameConnection.send("sendGameMessage", ["gift", giftId, playerId]);
    }

    static cancelLeave() {
        SocketService.gameConnection.send(WebSocketMessageType.LEAVE_GAME_CANCEL, []);
    }

    static sendChatTextMessage(messageTextCode: string): void {
        SocketService.gameConnection.send("sendGameMessage", ["text", "chat-text:" + messageTextCode]);
    }

    static sendChatSmileMessage(smileCode: string) {
        SocketService.gameConnection.send("sendGameMessage", ["smile", smileCode]);
    }

    static async sendTransaction(transaction: FacebookTransaction): Promise<boolean> {
        return new Promise(resolve => SocketService.mainConnection.send("purchased2", ["fbinstant", transaction], (error: any, data: any) => {
            console.log("server validated transaction data", data);
            console.log("server validated transaction error", error);
            resolve(!error);
        }));
    }

    static getPayload(productId: string): Promise<SocketPayload> {
        return new Promise<SocketPayload>(resolve => SocketService.mainConnection.send("tonPrepare", [productId], (_error: any, data: SocketPayload) => {
            resolve(data);
        }));
    }

    static async tonFetchAndAwait(payload: string): Promise<any> {
        return new Promise<SocketPayload>(resolve => SocketService.mainConnection.send("tonFetchAndWait", [payload], (_error: any, data: SocketPayload) => {
            resolve(data);
        }));
    }

    static async checkLeftWithoutDisconnected() {
        if (SocketService.leaveGameWhileDisconnected) {
            await LocalStorageService.setKeyValue(Settings.LEFT_WHILE_DISCONNECTED, SocketService.leaveGameWhileDisconnected = false);
            SocketService.leaveGame(false);
        }
    }

    static optimisticMove(iPossibleMoveData: IPossibleMoveData, selectedDominoItem: DominoItem) {
        this.mainConnection.connectionSent && SocketService.move(iPossibleMoveData);
        /*if (this.mainConnection.connectionSent) {
            SocketService.move(iPossibleMoveData);
        } else if (selectedDominoItem) {
            selectedDominoItem.pieceData.joint.piece.setAt(0, new NumberData(iPossibleMoveData.joint.piece[0]), iPossibleMoveData.joint.piece[0]);
            selectedDominoItem.pieceData.joint.piece.setAt(1, new NumberData(iPossibleMoveData.joint.piece[1]), iPossibleMoveData.joint.piece[1]);
            selectedDominoItem.pieceData.joint.dir = iPossibleMoveData.joint.dir;
            selectedDominoItem.pieceData.joint.value = iPossibleMoveData.joint.value;
            selectedDominoItem.pieceData.joint.additional = iPossibleMoveData.joint.additional;
            selectedDominoItem.pieceData.joint.joinValue = iPossibleMoveData.joint.joinValue;
            selectedDominoItem.pieceData.rot = PieceRot.DOWN;
            selectedDominoItem.pieceData.place = PiecePlace.PLAYED;
            ActiveData.dispatchEventsPool();
            SocketService.setReconnectMove(iPossibleMoveData);
        }*/
    }

    static checkReconnectMove() {
        SocketService.reconnectMove && SocketService.move(SocketService.reconnectMove);
        SocketService.reconnectMove = undefined;
    }

    private static setReconnectMove(iPossibleMoveData: IPossibleMoveData) {
        SocketService.reconnectMove = iPossibleMoveData;
    }

    static async revokeDelete(): Promise<boolean> {
        return new Promise<boolean>(resolve => SocketService.mainConnection.send("cancelDestroy", [], (error: any, _data: any) => {
            resolve(!error);
        }));
    }
}