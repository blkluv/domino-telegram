import {Sprite, NineSlicePlane} from "pixi.js";
import {DisplayObjectFactory, TonRates, LanguageText, Button, Pivot, NumberUtils} from "@azur-games/pixi-vip-framework";
import {DepositCurrencyChosen} from "../../../../../../game_events/DepositCurrencyChosen";
import {CurrencyItemDetail} from "./selection_item/CurrencyItemDetail";
import {CurrencyNameValues} from "./CurrencyName";


export class DepositCurrencySelectionItem extends Button {
    private background: NineSlicePlane;
    private divider: NineSlicePlane;
    private currencyIcon: Sprite;
    private currencyNameText: LanguageText;
    private minAmount: CurrencyItemDetail;
    private arrowIcon: Sprite;

    constructor(
        private currencyName: CurrencyNameValues,
        private rates: TonRates,
    ) {
        super({});
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    processClick() {
        dispatchEvent(new DepositCurrencyChosen({name: this.currencyName}));
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("deposit/currency_item_bg", 150, 50, 50, 50);
        this.divider = DisplayObjectFactory.createNineSlicePlane("deposit/currency_item_divider", 1, 1, 1, 1);
        console.log("LOG:this.currencyName ", this.currencyName);
        this.currencyIcon = DisplayObjectFactory.createSprite(`deposit/${this.currencyName}_symbol`);
        this.currencyNameText = new LanguageText({key: this.currencyName.toUpperCase(), fontSize: 40});
        this.minAmount = new CurrencyItemDetail("Min deposit: ", "$" + NumberUtils.shortPriceFormat(this.rates.minTransactionUsd));
        this.arrowIcon = DisplayObjectFactory.createSprite("deposit/right_arrow_icon");
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.divider);
        this.addChild(this.currencyIcon);
        this.addChild(this.currencyNameText);
        this.addChild(this.minAmount);
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
        Pivot.center(this.currencyNameText, false);
        Pivot.center(this.arrowIcon);

        this.background.y = 3;
        this.currencyIcon.x = -415;
        this.currencyNameText.x = -320;
        this.currencyNameText.y = -2;
        this.divider.x = 160;
        this.minAmount.x = 310;
        this.arrowIcon.x = 420;

    }

    destroy() {

        this.removeChild(this.background);
        this.removeChild(this.divider);
        this.removeChild(this.currencyIcon);
        this.removeChild(this.currencyNameText);
        this.removeChild(this.minAmount);
        this.removeChild(this.arrowIcon);

        this.background.destroy();
        this.divider.destroy();
        this.currencyIcon.destroy();
        this.currencyNameText.destroy();
        this.minAmount.destroy();
        this.arrowIcon.destroy();

        this.background = null;
        this.divider = null;
        this.currencyIcon = null;
        this.currencyNameText = null;
        this.minAmount = null;
        this.arrowIcon = null;
        this.currencyName = null;
        this.rates = null;

        super.destroy();
    }
}