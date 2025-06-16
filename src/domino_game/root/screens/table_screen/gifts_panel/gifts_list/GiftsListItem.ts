import {Button} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../DynamicData";
import {GameEvents} from "../../../../../../GameEvents";
import {GiftConfig} from "@azur-games/pixi-vip-framework";
import {ItemsService} from "@azur-games/pixi-vip-framework";
import {SocketService} from "../../../../../../services/SocketService";
import {GiftsPanel} from "../../GiftsPanel";
import {GiftListItemCost} from "./gift_list_item/GiftListItemCost";
import {GiftListItemCount} from "./gift_list_item/GiftListItemCount";


export class GiftsListItem extends Button {
    private cost: GiftListItemCost;
    private count: GiftListItemCount;
    private onConsumableItemsChangedBindThis: (e: MessageEvent) => void;
    private onProfileChangedBindThis: (e: MessageEvent) => void;

    constructor(private config: GiftConfig) {
        super({bgTextureName: config.iconTextureName});
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onConsumableItemsChangedBindThis = this.onConsumableItemsChanged.bind(this);
        this.onProfileChangedBindThis = this.onProfileChanged.bind(this);
        addEventListener(GameEvents.CONSUMABLE_ITEMS_CHANGED, this.onConsumableItemsChangedBindThis);
        addEventListener(GameEvents.PROFILE_UPDATED, this.onProfileChangedBindThis);
    }

    onConsumableItemsChanged(): void {
        this.config = ItemsService.getGiftById(this.config.id);
        this.count.changeCount(this.config.count);
        this.cost.updateColor(this.config);
    }

    onProfileChanged(): void {
        this.config = ItemsService.getGiftById(this.config.id);
        this.cost.updateColor(this.config);
    }

    createChildren(): void {
        this.cost = new GiftListItemCost(this.config);
        this.count = new GiftListItemCount(this.config.count);
    }

    addChildren(): void {
        this.addChild(this.cost);
        this.addChild(this.count);
    }

    initChildren(): void {
        this.cost.y = 70;
        this.count.y = -35;
        this.count.x = 30;
    }

    processClick(): void {
        if (this.config.cost > DynamicData.myProfile.coins && !this.config.count) {
            return;
        }
        SocketService.sendGift(this.config.id, GiftsPanel.playerID);
        this.enabled = false;
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_GIFTS_PANEL));
    }

    destroy(): void {
        removeEventListener(GameEvents.CONSUMABLE_ITEMS_CHANGED, this.onConsumableItemsChangedBindThis);
        removeEventListener(GameEvents.PROFILE_UPDATED, this.onProfileChangedBindThis);
        this.onConsumableItemsChangedBindThis = null;
        this.onProfileChangedBindThis = null;

        this.removeChild(this.cost);
        this.removeChild(this.count);
        this.cost.destroy();
        this.count.destroy();
        this.cost = null;
        this.count = null;
        super.destroy();
    }
}
