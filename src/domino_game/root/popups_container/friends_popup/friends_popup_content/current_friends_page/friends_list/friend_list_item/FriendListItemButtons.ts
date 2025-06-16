import {Button, LanguageService, LanguageText, PreloaderService, ScrollItem} from "@azur-games/pixi-vip-framework";
import {Point} from "pixi.js";
import {DynamicData} from "../../../../../../../../DynamicData";
import {GameEvents} from "../../../../../../../../GameEvents";
import {FriendStatus} from "../../../../../../../../services/socket_service/socket_message_data/friend_data/FriendStatus";
import {FriendData} from "../../../../../../../../services/socket_service/socket_message_data/FriendData";
import {ProfileData} from "../../../../../../../../services/socket_service/socket_message_data/ProfileData";
import {ChatEventMessage} from "../../../../../../../../services/socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {SocketService} from "../../../../../../../../services/SocketService";
import {FriendListItemType} from "./FriendListItemType";


export class FriendListItemButtons extends ScrollItem {
    private deleteButton: Button;
    private acceptButton: Button;
    private messageButton: Button;
    private requestButton: Button;
    private checkFriendStateBindThis: (e: Event) => void;

    constructor(private data: ProfileData, private type: FriendListItemType) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.checkFriendState();

        this.checkFriendStateBindThis = this.checkFriendState.bind(this);
        addEventListener(GameEvents.ON_FRIENDS_CHANGE, this.checkFriendStateBindThis);

        this.cacheAsBitmap = true;
    }

    createChildren(): void {
        this.deleteButton = new Button({callback: this.onDeleteClick.bind(this), bgTextureName: "friends/bg_red_shadow", iconTextureName: "friends/icon_delete"});
        this.acceptButton = new Button({callback: this.onAcceptClick.bind(this), bgTextureName: "friends/bg_green_shadow", iconTextureName: "friends/icon_check"});
        this.messageButton = new Button({callback: this.onMessageClick.bind(this), bgTextureName: "friends/bg_blue_shadow", iconTextureName: "friends/icon_message"});
        this.requestButton = new Button({
            callback: this.onRequestClick.bind(this),
            bgTextureName: "friends/bg_blue_shadow",
            bgCornersSize: 32,
            bgSizes: new Point(258, 68),
            textKey: "SEND REQUEST",
            fontSize: 26,
            autoFitWidth: 210
        });
    }

    addChildren(): void {
        this.addChild(this.deleteButton).visible = this.type != FriendListItemType.FIND;
        this.addChild(this.acceptButton).visible = this.type == FriendListItemType.NEW_REQUEST;
        this.addChild(this.messageButton).visible = this.type == FriendListItemType.CURRENT;
        this.addChild(this.requestButton).visible = this.type == FriendListItemType.FIND;
    }

    initChildren(): void {
        this.requestButton.languageText.setTextStroke(0, 3);
        this.requestButton.languageText.setTextShadow(0x195F7D, 2, 0);

        this.deleteButton.x = 200;
        this.acceptButton.x = 110;
        this.messageButton.x = 110;
        this.requestButton.x = 110;
    }

    async onDeleteClick(): Promise<void> {
        if (this.dragged) {
            return;
        }
        let deleteConfirmed: boolean = await new Promise(resolve => dispatchEvent(new MessageEvent(GameEvents.OPEN_DIALOG_POPUP, {
            data: {
                resolve,
                titleText: LanguageService.getTextByKey("DialogWindow/unfriend/title"),
                prompt: new LanguageText({key: "DialogWindow/unfriend/message", fontSize: 40, fill: 0x8f6942, autoFitWidth: 740, placeholders: [this.data.name]}),
                yesText: LanguageService.getTextByKey("DialogWindow/unfriend/yes"),
                noText: LanguageService.getTextByKey("DialogWindow/unfriend/no"),
            }
        })));
        deleteConfirmed && SocketService.removeFriend(this.data.id);
    }

    onAcceptClick(): void {
        if (this.dragged) {
            return;
        }
        SocketService.createFriend(this.data.id);
    }

    async onMessageClick(): Promise<void> {
        let preloaderId: number = PreloaderService.show();
        let messages: ChatEventMessage[] = await SocketService.getUserMessages(this.data.id);
        PreloaderService.hide(preloaderId);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_MESSAGES_POPUP, {data: {messages, profile: this.data}}));
    }

    async onRequestClick(): Promise<void> {
        if (this.dragged) {
            return;
        }
        this.cacheAsBitmap = false;
        SocketService.createFriend(this.data.id);

        this.deactivateSendRequestButton();
    }

    checkFriendState(): void {
        let friend: FriendData = DynamicData.myFriends.find(friend => friend.id == this.data.id);
        if (!friend) {
            return;
        }
        if ([FriendStatus.OUTGOING, FriendStatus.ACCEPTED].includes(friend.type)) {
            this.deactivateSendRequestButton();
        }
    }

    deactivateSendRequestButton(): void {
        console.log("this.deactivateSendRequestButton");
        this.requestButton.languageText.changeText("REQUEST SENT");
        this.requestButton.makeGreyAndDisabled();
    }

    destroy(): void {
        this.cacheAsBitmap = false;

        removeEventListener(GameEvents.ON_FRIENDS_CHANGE, this.checkFriendStateBindThis);
        this.checkFriendStateBindThis = null;

        this.removeChild(this.deleteButton);
        this.removeChild(this.acceptButton);
        this.removeChild(this.messageButton);
        this.removeChild(this.requestButton);

        this.deleteButton.destroy();
        this.acceptButton.destroy();
        this.messageButton.destroy();
        this.requestButton.destroy();

        this.deleteButton = null;
        this.acceptButton = null;
        this.messageButton = null;
        this.requestButton = null;

        super.destroy();
    }
}
