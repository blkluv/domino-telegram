import {NineSlicePlane, Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {ProductTag} from "../../../../../../../services/socket_service/socket_message_data/product_data/ProductTag";
import {ProductData} from "../../../../../../../services/socket_service/socket_message_data/ProductData";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {CoinsAmount} from "./store_item/CoinsAmount";
import {Discount} from "./store_item/Discount";
import {StoreItemFooter} from "./store_item/StoreItemFooter";


export class StoreItem extends Sprite {
    private background: NineSlicePlane;
    private iconTextureName: string;
    private icon: Sprite;
    private coinsAmount: CoinsAmount;
    private footer: StoreItemFooter;
    private bestIcon: Sprite;
    private discount: Discount;
    private best: boolean;
    private discountAmount: string;

    constructor(private productData: ProductData) {
        super();
        this.iconTextureName = "store/icon_coins_store" + this.productData.id.slice(-1);
        this.best = this.productData.tags.includes(ProductTag.BEST);
        this.discountAmount = this.productData.tags.find(tag => tag.includes("discount"))?.replace("discount:", "");
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.footer.coinIconOffsetX = this.coinsAmount.coinIconOffsetX;
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("store/store_item_bg", 50, 130, 50, 130);
        this.icon = DisplayObjectFactory.createSprite(this.iconTextureName);
        this.coinsAmount = new CoinsAmount(this.productData);
        this.footer = new StoreItemFooter(this.productData);
        this.discount = new Discount(this.discountAmount);
        this.bestIcon = DisplayObjectFactory.createSprite("store/Best");
    }

    addChildren(): void {
        this.addChild(this.footer);
        this.addChild(this.background);
        this.addChild(this.icon);
        this.addChild(this.coinsAmount);
        this.addChild(this.discount).visible = !!this.discountAmount;
        this.addChild(this.bestIcon).visible = this.best;
    }

    initChildren(): void {
        this.background.width = 340;
        this.background.height = 284;

        Pivot.center(this.background);
        Pivot.center(this.icon);

        this.iconTextureName == "store/icon_coins_store4" && (this.icon.pivot.y = 120);
        this.iconTextureName == "store/icon_coins_store5" && (this.icon.pivot.x = 85);
        this.iconTextureName == "store/icon_coins_store6" && (this.icon.pivot.x = 128);
        this.icon.scale.set(.9);

        this.icon.y = -20;
        this.icon.x = 10;
        this.coinsAmount.y = 80;
        this.footer.y = 184;
        this.discount.x = -132;
        this.discount.y = 30;
        this.bestIcon.y = -190;
        this.bestIcon.x = 55;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.icon);
        this.removeChild(this.coinsAmount);
        this.removeChild(this.footer);
        this.removeChild(this.bestIcon);
        this.removeChild(this.discount);

        this.background.destroy();
        this.icon.destroy();
        this.coinsAmount.destroy();
        this.footer.destroy();
        this.bestIcon.destroy();
        this.discount.destroy();

        this.background = null;
        this.icon = null;
        this.coinsAmount = null;
        this.footer = null;
        this.bestIcon = null;
        this.discount = null;

        super.destroy();
    }
}
