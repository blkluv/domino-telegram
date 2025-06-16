import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GiftConfig} from "@azur-games/pixi-vip-framework";


export class GiftListItemCost extends Sprite {
    private iconCoin: Sprite;
    private costText: LanguageText;

    constructor(private config: GiftConfig) {
        super();
        if (!this.config.cost) {
            return;
        }
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.updateColor(this.config);
    }

    createChildren(): void {
        this.iconCoin = DisplayObjectFactory.createSprite("common/currency_soft_crown");
        this.costText = new LanguageText({key: this.config.cost.toString(), fontSize: 26});
    }

    addChildren(): void {
        this.addChild(this.iconCoin);
        this.addChild(this.costText);
    }

    initChildren(): void {
        this.iconCoin.scale.set(.3);
        this.iconCoin.anchor.set(1, .5);
        this.costText.anchor.set(0, .5);
        this.iconCoin.x = -2;
        this.costText.x = 2;
    }

    updateColor(config: GiftConfig): void {
        if (!config.cost) {
            return;
        }
        this.config = config;
        this.costText.style.fill = DynamicData.myProfile.coins < config.cost ? "0xd11f2e" : "0xffffff";
    }

    destroy(): void {
        if (this.config.cost) {
            this.removeChild(this.iconCoin);
            this.removeChild(this.costText);
            this.iconCoin.destroy();
            this.costText.destroy();
            this.iconCoin = null;
            this.costText = null;
        }
        super.destroy();
    }
}
