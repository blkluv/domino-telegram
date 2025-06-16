import {Sprite} from "pixi.js";
import {DynamicData} from "../../../../DynamicData";
import {GameEvents} from "../../../../GameEvents";
import {ChatMessagesService} from "../../../../services/ChatMessagesService";
import {FriendStatus} from "../../../../services/socket_service/socket_message_data/friend_data/FriendStatus";
import {SoundsPlayer} from "../../../../services/SoundsPlayer";
import {SocialButton} from "./social_block/SocialButton";


export class SocialBlock extends Sprite {
    private buttonsMargin: number = 120;
    private messagesButton: SocialButton;
    private friendsButton: SocialButton;
    private updateFriendsButtonBindThis: (e: MessageEvent) => void;
    private updateMessagesButtonBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.updateFriendsButton();
        this.updateMessagesButton();

        this.updateFriendsButtonBindThis = this.updateFriendsButton.bind(this);
        addEventListener(GameEvents.ON_FRIENDS_CHANGE, this.updateFriendsButtonBindThis);
        this.updateMessagesButtonBindThis = this.updateMessagesButton.bind(this);
        addEventListener(GameEvents.USER_MESSAGES_STATUSES_CHANGED, this.updateMessagesButtonBindThis);
    }

    createChildren() {
        this.messagesButton = new SocialButton(this.onMessagesClick.bind(this), "lobby/icon_message");
        this.friendsButton = new SocialButton(this.onFriendsClick.bind(this), "lobby/icon_friends");
    }

    addChildren() {
        this.addChild(this.messagesButton);
        this.addChild(this.friendsButton);
    }

    initChildren() {
        this.messagesButton.x = -this.messagesButton.backgroundWidth / 2;
        this.messagesButton.y = this.messagesButton.backgroundHeight / 2;
        this.friendsButton.x = this.messagesButton.x - this.buttonsMargin;
        this.friendsButton.y = this.messagesButton.y;
    }

    onMessagesClick() {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_MESSAGES_POPUP));
    }

    onFriendsClick() {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_FRIENDS_POPUP));
    }

    updateFriendsButton() {
        let incomeFriendsRequestExist: boolean = DynamicData.myFriends.some(friend => friend.type == FriendStatus.INCOMING);
        incomeFriendsRequestExist && SoundsPlayer.play("message");
        this.friendsButton.showNotification(incomeFriendsRequestExist);
    }

    updateMessagesButton(): void {
        let messagesCount: number = ChatMessagesService.getAllUnreadMessagesCount();
        messagesCount && SoundsPlayer.play("message");
        this.messagesButton.showNotification(!!messagesCount);
    }

    destroy() {
        removeEventListener(GameEvents.ON_FRIENDS_CHANGE, this.updateFriendsButtonBindThis);
        removeEventListener(GameEvents.USER_MESSAGES_STATUSES_CHANGED, this.updateMessagesButtonBindThis);
        this.updateFriendsButtonBindThis = null;
        this.updateMessagesButtonBindThis = null;

        this.removeChild(this.messagesButton);
        this.removeChild(this.friendsButton);

        this.messagesButton.destroy();
        this.friendsButton.destroy();

        this.messagesButton = null;
        this.friendsButton = null;

        super.destroy();
    }
}