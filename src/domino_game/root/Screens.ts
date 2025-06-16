import {AppearanceContainer, LoginService, Timeout, WindowFocusController} from "@azur-games/pixi-vip-framework";
import {DominoGame} from "../../app";
import {SitPlace} from "../../dynamic_data/SitPlace";
import {Reason, SocketGameRequest} from "../../dynamic_data/SocketGameRequest";
import {SocketGameRequestState} from "../../dynamic_data/SocketGameRequestState";
import {DynamicData} from "../../DynamicData";
import {GameEvents} from "../../GameEvents";
import {GameMode} from "../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SocketMessageType} from "../../services/socket_service/SocketMessageType";
import {SocketService} from "../../services/SocketService";
import {SoundsPlayer} from "../../services/SoundsPlayer";
import {BaseScreen} from "./screens/BaseScreen";
import {LobbyScreen} from "./screens/LobbyScreen";
import {ScreenType} from "./screens/ScreenType";
import {LabelColor} from "./screens/table_screen/state_labels/StateLabel";
import {TableScreen} from "./screens/TableScreen";
import {WelcomeScreen} from "./screens/WelcomeScreen";


export class Screens extends AppearanceContainer {
    currentScreen: BaseScreen;

    constructor() {
        super();
        this.interactive = this.interactiveChildren = true;
        addEventListener(GameEvents.SCREEN_CHANGE, this.onScreenChange.bind(this));
        addEventListener(GameEvents.MUSIC_ON_CHANGED, this.onMusicOnChange.bind(this));
        addEventListener(GameEvents.FOCUS_CHANGED, this.onMusicOnChange.bind(this));
    }

    async waitLobbyScreen(): Promise<void> {
        DominoGame.instance.hideMainPreloader();
        this.changeScreen(ScreenType.WELCOME);
        await (this.currentScreen as WelcomeScreen).waitForLogin();
    }

    private onScreenChange(e: MessageEvent): void {
        let screenType: ScreenType = e.data.screen;
        let callback: Function = e.data.resolve;
        this.changeScreen(screenType, callback);
    }

    private changeScreen(newScreenType: ScreenType, callback?: Function): void {
        if (newScreenType == this.currentScreen?.screenType) {
            return;
        }
        if (this.currentScreen) {
            this.removeChild(this.currentScreen);
            this.currentScreen.destroy();
            this.currentScreen = undefined;
        }

        switch (newScreenType) {
            case ScreenType.WELCOME:
                this.currentScreen = new WelcomeScreen();
                break;
            case ScreenType.LOBBY:
                this.currentScreen = new LobbyScreen();
                break;
            case ScreenType.TABLE:
                this.currentScreen = new TableScreen();
                break;
        }

        this.addChild(this.currentScreen);
        callback && callback();

        if ([ScreenType.LOBBY].includes(newScreenType)) {
            SoundsPlayer.stopMusic();
            SoundsPlayer.playLobbyMusic();
        }
    }

    async gameSync(socketGameRequest: SocketGameRequest): Promise<void> {
        SoundsPlayer.handleGameMusic();
        if (!socketGameRequest || socketGameRequest.state == SocketGameRequestState.LEFT) {
            let currentScreenTable: boolean = this.currentScreen?.screenType == ScreenType.TABLE;
            if (WindowFocusController.documentVisible && currentScreenTable) {
                switch (socketGameRequest?.reason) {
                    case Reason.HIGH_COINS:
                        await (this.currentScreen as TableScreen).highCoins();
                        await Timeout.seconds(2);
                        break;
                    case Reason.LOW_COINS:
                        await (this.currentScreen as TableScreen).lowCoins();
                        await Timeout.seconds(2);
                        break;
                    case Reason.AFK:
                        await (this.currentScreen as TableScreen).afk();
                        await Timeout.seconds(2);
                        break;
                }
            }

            socketGameRequest && await SocketService.cancelGameRequest();
            SocketService.roomRepeating || dispatchEvent(new MessageEvent(GameEvents.SCREEN_CHANGE, {data: {screen: ScreenType.LOBBY}}));
            return;

        }
        SocketService.roomRepeating = false;
        let resultWindowToShow: boolean;
        let endless: boolean = DynamicData.socketGameRequest.mode == GameMode.PRO;
        if (this.currentScreen?.screenType == ScreenType.TABLE) {
            if (socketGameRequest == null) {
                dispatchEvent(new MessageEvent(GameEvents.SCREEN_CHANGE, {data: {screen: ScreenType.LOBBY}}));
            } else {
                let tableScreen: TableScreen = (this.currentScreen as TableScreen);
                switch (socketGameRequest.state) {
                    case SocketGameRequestState.LOST:
                    case SocketGameRequestState.WON:
                        resultWindowToShow = true;
                        if ([SitPlace.RIGHT, SitPlace.TOP, SitPlace.LEFT].includes(DynamicData.exitPlayer)) {
                            await tableScreen.stateLabels.createLabel(LabelColor.BLUE, "TableMessages/GameResigned");
                            await Timeout.seconds(2);
                        }
                        tableScreen.showResultWindow();
                        break;
                }
            }
        } else if (socketGameRequest?.queue || endless && !SocketService.leaveGameWhileDisconnected) {
            await new Promise(resolve => dispatchEvent(new MessageEvent(GameEvents.SCREEN_CHANGE, {
                data: {
                    screen: ScreenType.TABLE,
                    resolve
                }
            })));
            if ([SocketGameRequestState.STARTED, SocketGameRequestState.LEAVING, SocketMessageType.SPECTATING].includes(socketGameRequest.state)) {
                (this.currentScreen as TableScreen).showLoader(false);
            }
        }

        if ([SocketGameRequestState.STARTED, SocketGameRequestState.LEAVING, SocketMessageType.SPECTATING].includes(socketGameRequest.state)) {
            if (socketGameRequest.workerUrl && !SocketService.gameConnection.connected) {
                SocketService.gameConnection.init(socketGameRequest.workerUrl, {
                    stateDeltaEnabled: true,
                    token: "game:" + socketGameRequest.gameId + ":" + socketGameRequest.userId + ":" + LoginService.registerResponse.accessKey
                }, "/game");
            }
        }
        if (resultWindowToShow) {
            return;
        }
        if ([SocketGameRequestState.WON, SocketGameRequestState.LOST].includes(socketGameRequest.state)
            && !SocketService.gameConnection.connected
            && DominoGame.instance.root.screens.currentScreen.screenType == ScreenType.TABLE) {
            (DominoGame.instance.root.screens.currentScreen as TableScreen).showResultWindow(true);
        }
    }

    private onMusicOnChange(): void {
        switch (this.currentScreen?.screenType) {
            case ScreenType.WELCOME:
                return;
            case ScreenType.LOBBY:
                SoundsPlayer.playLobbyMusic();
                break;
            default:
                SoundsPlayer.handleGameMusic();
        }
    }
}