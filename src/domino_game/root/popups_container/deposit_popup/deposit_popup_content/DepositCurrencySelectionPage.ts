import {LanguageText, Pivot, TonRates} from "@azur-games/pixi-vip-framework";
import {Sprite} from "pixi.js";
import {DepositSteps} from "./currency_selection_page/DepositSteps";
import {CurrencyName} from "./currency_selection_page/CurrencyName";
import {DepositCurrencySelectionItem} from "./currency_selection_page/DepositCurrencySelectionItem";


export class DepositCurrencySelectionPage extends Sprite {
    private title: LanguageText;
    private stepsDescription: DepositSteps;
    private methodsText: LanguageText;
    private currencies: DepositCurrencySelectionItem[];

    constructor(private rates: TonRates) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.title = new LanguageText({key: "Deposit", fontSize: 56, fontWeight: "500", fill: 0xF1F3FF});
        this.stepsDescription = new DepositSteps();
        this.methodsText = new LanguageText({key: "Main methods:", fontSize: 40, fill: 0xF1F3FF, fontWeight: "500"});

        const currencyConfigs = [
            {name: CurrencyName.TON, rates: this.rates},
        ];
        this.currencies = currencyConfigs.map(config =>
            new DepositCurrencySelectionItem(config.name, config.rates)
        );
    }

    addChildren() {
        this.addChild(this.title);
        this.addChild(this.stepsDescription);
        this.addChild(this.methodsText);
        this.currencies.forEach(currency => {
            this.addChild(currency);
        });
    }

    initChildren() {
        Pivot.center(this.methodsText, false);
        Pivot.center(this.title);

        this.title.y = 90;
        this.stepsDescription.y = 380;
        this.methodsText.y = 660;
        this.methodsText.x = -475;

        this.currencies.forEach((currency, i) => {
            currency.y = i * 145 + 780;
        });
    }

    destroy() {
        while (this.currencies.length) {
            const currency = this.currencies.shift();
            currency.destroy();
            this.removeChild(currency);
        }

        this.removeChild(this.title);
        this.removeChild(this.stepsDescription);
        this.removeChild(this.methodsText);

        this.methodsText.destroy();
        this.title.destroy();
        this.stepsDescription.destroy();

        this.methodsText = null;
        this.currencies = null;
        this.title = null;
        this.stepsDescription = null;

        super.destroy();
    }
}