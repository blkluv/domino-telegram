import {NineSlicePlane} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Player} from "../../../../../../../common/Player";
import {ScrollItem} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../../DynamicData";
import {GameEvents} from "../../../../../../../GameEvents";
import {AvatarService} from "../../../../../../../services/AvatarService";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {ProfileData} from "../../../../../../../services/socket_service/socket_message_data/ProfileData";
import {UserOnlineStatus} from "../../../../../../../services/socket_service/UserOnlineStatus";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class Message extends ScrollItem {
    myMessage: boolean;
    player: Player;
    messageText: LanguageText;
    background: NineSlicePlane;
    private onProfileUpdatedBindThis: (e: Event) => void;

    constructor(private profileData: ProfileData, private messageTextValue: string) {
        super();
        this.myMessage = this.profileData.id == DynamicData.myProfile.id;
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onProfileUpdatedBindThis = this.onProfileUpdated.bind(this);
        addEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
        this.cacheAsBitmap = true;
    }

    createChildren() {
        this.player = new Player({callback: this.onPlayerClick.bind(this), showLevel: false, showOnlineStatus: !this.myMessage, showFacebookIcon: !this.myMessage});
        this.messageText = new LanguageText({key: this.messageTextValue, fontSize: 25, fill: 0x45408A, align: "left"});
        this.background = new NineSlicePlane(LoaderService.getTexture("messages/message_bg_" + (this.myMessage ? "white" : "purple")), 48, 34, this.myMessage ? 48 : 34, 34);
    }

    addChildren() {
        this.addChild(this.player).applyData(this.profileData);
        this.addChild(this.background);
        this.addChild(this.messageText);
    }

    initChildren() {
        this.messageText.style.wordWrapWidth = 800;
        this.messageText.style.wordWrap = true;
        this.messageText.style.breakWords = true;

        this.background.width = Math.min(this.messageText.width + 80, 900);
        this.background.height = Math.max(this.messageText.height + 40, 101);
        this.player.scale.set(.9);
        this.player.updateOnlineIcon(false);

        Pivot.center(this.messageText);
        Pivot.center(this.background);

        this.x = this.myMessage ? 550 : -570;

        if (this.myMessage) {
            this.messageText.x = -this.background.width / 2 - 90;
            this.background.x = this.messageText.x + 10;
        } else {
            this.messageText.x = this.background.width / 2 + 90;
            this.background.x = this.messageText.x - 10;
        }
        this.messageText.y = -3;

        if (this.background.height < this.player.totalWidth) {
            this.background.y = (this.player.totalWidth - this.background.height) / 2;
            this.messageText.y = this.background.y - 3;
        } else {
            this.player.y = (this.background.height - this.player.totalWidth) / 2;
        }
    }

    setDragged(dragged: boolean = true) {
        this.dragged = dragged;
    }

    // updateOnlineStatus(onlineStatus: UserOnlineStatus) {
    //     if (this.myMessage) {
    //         return;
    //     }
    //     this.player.updateAvatarByName(onlineStatus.name, onlineStatus.icon);
    // }

    async onPlayerClick() {
        if (this.dragged) {
            return;
        }
        let profileData: ProfileData = await DynamicData.profiles.getFullProfileById(this.profileData.id);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_PROFILE_POPUP, {data: {profileData}}));
    }

    onProfileUpdated() {
        if (this.myMessage) {
            this.player.applyData(DynamicData.myProfile);
        }
    }

    get totalHeight(): number {
        return Math.max(this.player.totalWidth, this.background.height);
    }

    get yOffset(): number {
        return this.background.height <= this.player.totalWidth ? 0 : this.background.height / 2 - this.player.totalWidth / 2;
    }

    updateOnlineStatus(onlineStatus: UserOnlineStatus): void {
        if (this.myMessage) {
            return;
        }
        this.cacheAsBitmap = false;
        this.player.updateOnlineIcon(onlineStatus.online);
        this.profileData.icon == onlineStatus.icon || this.player.setAvatar(AvatarService.getTextureNameByIcon(onlineStatus.icon));
        this.cacheAsBitmap = true;
    }

    destroy(): void {
        this.cacheAsBitmap = false;
        removeEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
        this.onProfileUpdatedBindThis = null;

        this.removeChild(this.player);
        this.removeChild(this.messageText);
        this.removeChild(this.background);

        this.player.destroy();
        this.messageText.destroy();
        this.background.destroy();

        this.player = null;
        this.messageText = null;
        this.background = null;

        super.destroy();
    }

}