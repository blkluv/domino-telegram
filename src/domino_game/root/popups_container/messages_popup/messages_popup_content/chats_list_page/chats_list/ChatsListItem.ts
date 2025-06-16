import {Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Player} from "../../../../../../../common/Player";
import {ScrollItem} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../../DynamicData";
import {GameEvents} from "../../../../../../../GameEvents";
import {AvatarService} from "../../../../../../../services/AvatarService";
import {ProfileData} from "../../../../../../../services/socket_service/socket_message_data/ProfileData";
import {UserOnlineStatus} from "../../../../../../../services/socket_service/UserOnlineStatus";
import {SocketService} from "../../../../../../../services/SocketService";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {StringUtils} from "@azur-games/pixi-vip-framework";


export class ChatsListItem extends ScrollItem {
    protected background: Button;
    protected player: Player;
    protected lastVisitText: LanguageText;
    protected nameText: LanguageText;

    constructor(protected profileData: ProfileData) {
        super();
        this.background = new Button({callback: this.processClick.bind(this), bgTextureName: "friends/item_bg_dark", bgCornersSize: 25, bgSizes: new Point(1250, 110)});
        this.player = new Player({callback: this.onPlayerClick.bind(this), showLevel: false, showFacebookIcon: true, showOnlineStatus: true});

        this.addChild(this.background);
        this.addChild(this.player);

        this.player.applyData(this.profileData);
        this.player.scale.set(.75);

        Pivot.center(this.background);
        this.player.x = -570;

        this.cacheAsBitmap = true;
    }

    async onPlayerClick(): Promise<void> {
        if (this.dragged) {
            return;
        }
        let profileData: ProfileData = await DynamicData.profiles.getFullProfileById(this.profileData.id);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_PROFILE_POPUP, {data: {profileData}}));
    }

    processClick(): void {
        console.log("need to override");
    }

    async updateOnlineStatus(): Promise<void> {
        this.cacheAsBitmap = false;
        let onlineStatus: UserOnlineStatus = await SocketService.getOnlineStatus(this.profileData.id);
        this.player.updateOnlineIcon(onlineStatus.online);
        this.profileData.icon == onlineStatus.icon || this.player.setAvatar(AvatarService.getTextureNameByIcon(onlineStatus.icon));
        this.profileData.name == onlineStatus.name || this.nameText.changeText(onlineStatus.name, false);
        this.lastVisitText.applyPlaceholders([StringUtils.formatDate(new Date(onlineStatus.lastVisit))]);
        this.lastVisitText.visible = !onlineStatus.online;
        this.cacheAsBitmap = true;
    }

    destroy(): void {
        this.cacheAsBitmap = false;

        this.removeChild(this.background);
        this.removeChild(this.player);
        this.removeChild(this.nameText);
        this.removeChild(this.lastVisitText);

        this.background.destroy();
        this.player.destroy();
        this.nameText.destroy();
        this.lastVisitText.destroy();

        this.background = null;
        this.player = null;
        this.nameText = null;
        this.lastVisitText = null;

        super.destroy();
    }
}
