import {DisplayObjectFactory, LanguageText, NumberUtils, Pivot, ScrollItem, StringUtils} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Sprite} from "pixi.js";
import {Player} from "../../../../../../../common/Player";
import {DynamicData} from "../../../../../../../DynamicData";
import {GameEvents} from "../../../../../../../GameEvents";
import {ProfileData} from "../../../../../../../services/socket_service/socket_message_data/ProfileData";
import {FriendListItemButtons} from "./friend_list_item/FriendListItemButtons";
import {FriendListItemType} from "./friend_list_item/FriendListItemType";


export class FriendsListItem extends ScrollItem {
    private background: NineSlicePlane;
    private player: Player;
    private nameText: LanguageText;
    private onlineText: LanguageText;
    private lastVisitText: LanguageText;
    private iconCoin: Sprite;
    private coinsText: LanguageText;
    private buttons: FriendListItemButtons;

    constructor(private profileData: ProfileData, private type: FriendListItemType) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.cache(true);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("friends/item_bg_dark", 25, 25, 25, 25);
        this.player = new Player({callback: this.onPlayerClick.bind(this), showLevel: true});
        this.nameText = new LanguageText({key: this.profileData.name, fontSize: 33, autoFitWidth: 260});
        this.onlineText = new LanguageText({key: "online", fontSize: 19, fontWeight: "600", fill: 0x06F62D});
        this.lastVisitText = new LanguageText({key: "FriendRecord.last-visit", fontSize: 19, fontWeight: "600", fill: 0xA8A2FF, placeholders: [StringUtils.formatDate(new Date(this.profileData.lastVisit))]});
        this.iconCoin = DisplayObjectFactory.createSprite("common/currency_soft_crown");
        this.coinsText = new LanguageText({key: NumberUtils.coinsKiloFormat(this.profileData.coins), fontSize: 26});
        this.buttons = new FriendListItemButtons(this.profileData, this.type);
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.player);
        this.addChild(this.nameText);
        this.addChild(this.onlineText).visible = this.profileData.online;
        this.addChild(this.lastVisitText).visible = !this.profileData.online;
        this.addChild(this.iconCoin);
        this.addChild(this.coinsText);
        this.addChild(this.buttons);
    }

    initChildren(): void {
        this.nameText.setTextStroke(0x4D4799, 4);
        this.coinsText.setTextStroke(0x4D4799, 4, false);
        this.player.applyData(this.profileData);

        this.background.width = 920;
        this.background.height = 100;

        this.player.scale.set(.8);
        this.iconCoin.scale.set(.3);

        Pivot.center(this.background);
        Pivot.center(this.onlineText);
        Pivot.center(this.lastVisitText);
        Pivot.center(this.iconCoin);
        Pivot.center(this.coinsText, false);
        this.player.x = -400;
        this.nameText.x = -180;
        this.lastVisitText.x = this.onlineText.x = -180;
        this.nameText.y = -15;
        this.lastVisitText.y = this.onlineText.y = 19;
        this.iconCoin.x = -20;
        this.iconCoin.y = 2;
        this.buttons.x = 200;
    }

    async onPlayerClick(): Promise<void> {
        if (this.dragged) {
            return;
        }
        let profileData: ProfileData = await DynamicData.profiles.getFullProfileById(this.profileData.id);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_PROFILE_POPUP, {data: {profileData}}));
    }

    setDragged(dragged: boolean = true): void {
        super.setDragged(dragged);
        this.buttons.setDragged(dragged);
    }

    cache(value: boolean): void {
        this.background.cacheAsBitmap = value;
        this.player.cacheAsBitmap = value;
        this.nameText.cacheAsBitmap = value;
        this.onlineText.cacheAsBitmap = value;
        this.lastVisitText.cacheAsBitmap = value;
        this.iconCoin.cacheAsBitmap = value;
        this.coinsText.cacheAsBitmap = value;
    }

    destroy(): void {
        this.cache(false);

        this.removeChild(this.background);
        this.removeChild(this.player);
        this.removeChild(this.nameText);
        this.removeChild(this.onlineText);
        this.removeChild(this.lastVisitText);
        this.removeChild(this.iconCoin);
        this.removeChild(this.coinsText);
        this.removeChild(this.buttons);

        this.background.destroy();
        this.player.destroy();
        this.nameText.destroy();
        this.onlineText.destroy();
        this.lastVisitText.destroy();
        this.iconCoin.destroy();
        this.coinsText.destroy();
        this.buttons.destroy();

        this.background = null;
        this.player = null;
        this.nameText = null;
        this.onlineText = null;
        this.lastVisitText = null;
        this.iconCoin = null;
        this.coinsText = null;
        this.buttons = null;

        super.destroy();
    }
}

