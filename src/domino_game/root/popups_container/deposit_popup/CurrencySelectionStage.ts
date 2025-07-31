import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {CurrencyItem} from "./components/CurrencyItem";


export class CurrencySelectionStage extends Sprite {
    private titleText: LanguageText;
    private currencies: CurrencyItem[];

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.titleText = new LanguageText({key: "Main methods:", fontSize: 40, fill: 0xF1F3FF, fontWeight: "500"});
        this.currencies = [
            new CurrencyItem("USDT TRC20", "usdt_trc20_symbol", "$4.00", "$5.69"),
            new CurrencyItem("TON", "ton_symbol", "$0.52", "$0.98"),
            new CurrencyItem("TON", "ton_symbol", "$0.52", "$0.98"),
            new CurrencyItem("USDT TRC20", "usdt_trc20_symbol", "$4.00", "$5.69"),
        ];
    }

    addChildren() {
        this.addChild(this.titleText);
        this.currencies.forEach(currency => {
            this.addChild(currency);
        });
    }

    initChildren() {
        Pivot.center(this.titleText, false);
        this.titleText.x = -475;
        this.currencies.forEach((currency, i) => {
            currency.y = i * 145 + 120;
        });
    }

    destroy() {

        while (this.currencies.length) {
            const currency = this.currencies.shift();
            currency.destroy();
            this.removeChild(currency);
        }

        this.removeChild(this.titleText);
        this.titleText.destroy();
        this.titleText = null;
        this.currencies = null;

        super.destroy();
    }
}