import {Sprite, NineSlicePlane} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Button} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {CurrencyItemDetail} from "./CurrencyItemDetail";


export class CurrencyItem extends Button {
    private background: NineSlicePlane;
    private divider: NineSlicePlane;
    private currencyIcon: Sprite;
    private currencyName: LanguageText;
    private minAmount: CurrencyItemDetail;
    private networkFee: CurrencyItemDetail;
    private arrowIcon: Sprite;

    constructor(
        private nameValue: string,
        private iconTexture: string,
        private minAmountValue: string,
        private networkFeeValue: string
    ) {
        super({});
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("deposit/currency_item_bg", 150, 50, 50, 50);
        this.divider = DisplayObjectFactory.createNineSlicePlane("deposit/currency_item_divider", 1, 1, 1, 1);
        this.currencyIcon = DisplayObjectFactory.createSprite(`deposit/${this.iconTexture}`);
        this.currencyName = new LanguageText({key: this.nameValue, fontSize: 40});
        this.minAmount = new CurrencyItemDetail("Min deposit:", this.minAmountValue);
        this.networkFee = new CurrencyItemDetail("Network fee:", this.networkFeeValue);
        this.arrowIcon = DisplayObjectFactory.createSprite("deposit/right_arrow_icon");
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.divider);
        this.addChild(this.currencyIcon);
        this.addChild(this.currencyName);
        this.addChild(this.minAmount);
        this.addChild(this.networkFee);
        this.addChild(this.arrowIcon);
    }

    initChildren() {
        this.background.width = 960;
        this.background.height = 140;

        this.divider.width = 3;
        this.divider.height = 84;

        Pivot.center(this.background);
        Pivot.center(this.divider);
        Pivot.center(this.currencyIcon);
        Pivot.center(this.currencyName, false);
        Pivot.center(this.arrowIcon);

        this.background.y = 3;

        this.currencyIcon.x = -415;
        this.currencyName.x = -320;
        this.currencyName.y = -2;
        this.divider.x = 60;
        this.minAmount.x = 160;
        this.networkFee.x = 310;
        this.arrowIcon.x = 420;

    }

    destroy() {
        this.removeChild(this.background);
        this.removeChild(this.divider);
        this.removeChild(this.currencyIcon);
        this.removeChild(this.currencyName);
        this.removeChild(this.minAmount);
        this.removeChild(this.networkFee);
        this.removeChild(this.arrowIcon);

        this.background.destroy();
        this.divider.destroy();
        this.currencyIcon.destroy();
        this.currencyName.destroy();
        this.minAmount.destroy();
        this.networkFee.destroy();
        this.arrowIcon.destroy();

        this.background = null;
        this.divider = null;
        this.currencyIcon = null;
        this.currencyName = null;
        this.minAmount = null;
        this.networkFee = null;
        this.arrowIcon = null;

        super.destroy();
    }
}