import {Point, Sprite, Text} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {Player} from "../../../../../common/Player";
import {DynamicData} from "../../../../../DynamicData";
import {TextFactory} from "../../../../../factories/TextFactory";
import {GameEvents} from "../../../../../GameEvents";
import {PreloaderService} from "@azur-games/pixi-vip-framework";
import {FriendStatus} from "../../../../../services/socket_service/socket_message_data/friend_data/FriendStatus";
import {FriendData} from "../../../../../services/socket_service/socket_message_data/FriendData";
import {ProfileData} from "../../../../../services/socket_service/socket_message_data/ProfileData";
import {ChatEventMessage} from "../../../../../services/socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {SocketService} from "../../../../../services/SocketService";
import {NameBlock} from "./profile_sidebar/NameBlock";
import {ProfileSidebarField} from "./profile_sidebar/ProfileSidebarField";


export class ProfileSidebar extends Sprite {
    private nameBlock: NameBlock;
    private player: Player;
    private idText: Text;
    private coinsField: ProfileSidebarField;
    private friendsField: ProfileSidebarField;
    private addToFriendButton: Button;
    private writeButton: Button;
    private onProfileUpdatedBindThis: (e: Event) => void;
    private onFriendsChangeBindThis: (e: Event) => void;

    constructor(private profileData: ProfileData) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.setButtonsState();
        this.onProfileUpdatedBindThis = this.onProfileUpdated.bind(this);
        addEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
        this.onFriendsChangeBindThis = this.onFriendsChange.bind(this);
        addEventListener(GameEvents.ON_FRIENDS_CHANGE, this.onFriendsChangeBindThis);
    }

    createChildren(): void {
        this.nameBlock = new NameBlock(this.profileData);
        this.player = new Player({callback: this.profileData.id == DynamicData.myProfile.id ? this.onPlayerClick.bind(this) : null, showLevel: true});
        this.idText = TextFactory.createCommissioner({value: "ID: " + this.profileData.id, fontSize: 24, fill: 0x594890});
        this.coinsField = new ProfileSidebarField("profile/gold_field", this.profileData.coins);
        this.friendsField = new ProfileSidebarField("profile/friends_field", this.profileData.friendsCount);
        this.addToFriendButton = new Button({
            callback: this.onAddToFriendClick.bind(this),
            bgTextureName: "common/ButtonGreen",
            bgCornersSize: 52,
            bgSizes: new Point(300, 75),
            textKey: "Profile/AddToFriends",
            fontSize: 32,
            textPosition: new Point(0, -2),
            autoFitWidth: 250
        });
        this.writeButton = new Button({
            callback: this.onWriteClick.bind(this),
            bgTextureName: "common/ButtonGreen",
            bgCornersSize: 52,
            bgSizes: new Point(300, 75),
            textKey: "Profile/OpenConversation",
            fontSize: 32,
            textPosition: new Point(0, -2),
            autoFitWidth: 250
        });
    }

    addChildren(): void {
        this.addChild(this.nameBlock);
        this.addChild(this.player);
        this.addChild(this.idText);
        this.addChild(this.coinsField);
        this.addChild(this.friendsField);
        this.addChild(this.addToFriendButton);
        this.addChild(this.writeButton);
    }

    initChildren(): void {
        this.addToFriendButton.languageText.setTextShadow();
        this.writeButton.languageText.setTextShadow();
        this.player.applyData(this.profileData);
        this.idText.alpha = .46;

        this.player.y = -200;
        this.idText.y = -150;
        this.idText.x = -220;
        this.nameBlock.y = -74;
        this.coinsField.y = 20;
        this.coinsField.valueText.y = -3;
        this.friendsField.y = 90;
        this.addToFriendButton.y = 360;
        this.writeButton.y = 360;
    }

    onProfileUpdated() {
        if (this.profileData.id != DynamicData.myProfile.id) {
            return;
        }
        this.nameBlock.update(DynamicData.myProfile.name);
        this.player.applyData(DynamicData.myProfile);
    }

    onFriendsChange(): void {
        this.setButtonsState();
    }

    async onAddToFriendClick(): Promise<void> {
        await SocketService.createFriend(this.profileData.id);
    }

    async onWriteClick(): Promise<void> {
        let preloaderId: number = PreloaderService.show();
        let messages: ChatEventMessage[] = await SocketService.getUserMessages(this.profileData.id);
        PreloaderService.hide(preloaderId);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_MESSAGES_POPUP, {data: {messages, profile: this.profileData}}));
    }

    onPlayerClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_EDIT_PROFILE_POPUP));
    }

    setButtonsState(): void {
        let friendAlready: FriendData = DynamicData.myFriends.find(friend => friend.id == this.profileData.id);
        this.addToFriendButton.visible = this.profileData.id != DynamicData.myProfile.id && friendAlready?.type != FriendStatus.ACCEPTED;
        friendAlready?.type == FriendStatus.OUTGOING ? this.addToFriendButton.makeGreyAndDisabled() : (this.addToFriendButton.enabled = true);
        this.writeButton.visible = !this.addToFriendButton.visible && this.profileData.id != DynamicData.myProfile.id;
        console.log("DynamicData.socketGameRequest ==? ", DynamicData.socketGameRequest);
        DynamicData.socketGameRequest && this.writeButton.makeGreyAndDisabled();
    };

    destroy(): void {
        removeEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
        this.onProfileUpdatedBindThis = null;
        removeEventListener(GameEvents.ON_FRIENDS_CHANGE, this.onFriendsChangeBindThis);
        this.onFriendsChangeBindThis = null;

        this.removeChild(this.nameBlock);
        this.removeChild(this.player);
        this.removeChild(this.idText);
        this.removeChild(this.coinsField);
        this.removeChild(this.friendsField);
        this.removeChild(this.addToFriendButton);
        this.removeChild(this.writeButton);

        this.nameBlock.destroy();
        this.player.destroy();
        this.idText.destroy();
        this.coinsField.destroy();
        this.friendsField.destroy();
        this.addToFriendButton.destroy();
        this.writeButton.destroy();

        this.nameBlock = null;
        this.player = null;
        this.idText = null;
        this.coinsField = null;
        this.friendsField = null;
        this.addToFriendButton = null;
        this.writeButton = null;

        super.destroy();
    }

}