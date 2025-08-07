import {DisplayObjectFactory, LanguageText, LoaderService, NumberUtils, Pivot, TonRates} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Sprite} from "pixi.js";
import {AddressBlock} from "./currency_page/AddressBlock";
import {CurrencyInput} from "./currency_page/CurrencyInput";
import {QRCodeBlock} from "./currency_page/QRCodeBlock";
import {WarningBlock} from "./currency_page/WarningBlock";
import {DepositCurrencyInfo} from "./currency_page/DepositCurrencyInfo";
import {CurrencyNameValues} from "./currency_selection_page/CurrencyName";


export class DepositCurrencyPage extends Sprite {
    private rates: TonRates;
    private currencyIcon: Sprite;
    private currencyTitle: LanguageText;
    private warningText: LanguageText;
    private warningBlock: WarningBlock;
    private qrCodeBlock: QRCodeBlock;
    private addressBlock: AddressBlock;
    private input: CurrencyInput;
    private minAmount: DepositCurrencyInfo;
    private divider: NineSlicePlane;
    private estimatedRate: DepositCurrencyInfo;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();

    }

    createChildren() {
        this.currencyIcon = DisplayObjectFactory.createSprite();
        this.currencyTitle = new LanguageText({key: "", fontSize: 56, fill: 0xF1F3FF, fontWeight: "500"});
        this.warningText = new LanguageText({key: "", fontSize: 32, fill: 0x536DAE, fontWeight: "400"});
        this.warningBlock = new WarningBlock();
        this.qrCodeBlock = new QRCodeBlock();
        this.addressBlock = new AddressBlock();
        this.input = new CurrencyInput(this.onInput.bind(this));
        this.minAmount = new DepositCurrencyInfo("Minimum amount:");

        this.divider = DisplayObjectFactory.createNineSlicePlane("deposit/currency_item_divider", 1, 1, 1, 1);
        this.estimatedRate = new DepositCurrencyInfo("Estimated rate:");
    }

    addChildren() {
        this.addChild(this.currencyIcon);
        this.addChild(this.currencyTitle);
        this.addChild(this.warningText);
        this.addChild(this.warningBlock);
        this.addChild(this.addressBlock);
        this.addChild(this.input);
        this.addChild(this.minAmount);
        this.addChild(this.divider);
        this.addChild(this.estimatedRate);
        this.addChild(this.qrCodeBlock);
    }

    initChildren() {
        this.divider.width = 960;
        this.divider.height = 2;

        Pivot.center(this.currencyTitle, false);
        Pivot.center(this.divider);
        Pivot.center(this.currencyIcon);
        Pivot.center(this.warningText);

        this.currencyIcon.scale.set(.8);
        this.currencyIcon.x = -80;
        this.currencyIcon.y = 90;
        this.currencyTitle.x = -10;
        this.currencyTitle.y = 90;

        this.warningText.style.wordWrap = true;
        this.warningText.style.wordWrapWidth = 900;
        this.warningText.y = 280;
        this.warningBlock.y = 430;

        this.qrCodeBlock.y = 680;
        this.addressBlock.y = 880;

        this.input.y = 1030;

        const detailsY = 1280;
        this.minAmount.y = detailsY;
        this.divider.y = detailsY + 55;

        this.estimatedRate.y = detailsY + 70;

    }

    onInput(inputValue: number) {
        if (!inputValue) {
            this.estimatedRate.applyData("0 coins");
            return;
        }
        const rate = (inputValue * this.rates.inUsdtToCoin * this.rates.ton2usdt).toFixed(0);
        this.estimatedRate.applyData(rate + " coins");
    }

    applyData(currencyName: CurrencyNameValues, rates: TonRates) {
        this.rates = rates;
        this.currencyIcon.texture = LoaderService.getTexture(`deposit/${currencyName}_symbol`);
        this.currencyTitle.changeText(currencyName.toUpperCase(), false);
        this.warningText.changeText(`Send only ${currencyName.toUpperCase()} to this address, otherwise, you may lose your funds.`,);
        this.input.applyData(rates);
        this.qrCodeBlock.applyData(rates.addr);
        this.addressBlock.applyData(rates.addr);
        this.minAmount.applyData("$" + NumberUtils.shortPriceFormat(rates.minTransactionUsd));
        this.estimatedRate.applyData("0 coins");
        this.initChildren();
    }

    destroy() {

        this.removeChild(this.input);
        this.removeChild(this.minAmount);
        this.removeChild(this.divider);
        this.removeChild(this.estimatedRate);
        this.removeChild(this.currencyIcon);
        this.removeChild(this.currencyTitle);
        this.removeChild(this.warningText);
        this.removeChild(this.warningBlock);
        this.removeChild(this.qrCodeBlock);
        this.removeChild(this.addressBlock);

        this.input.destroy();
        this.minAmount.destroy();
        this.divider.destroy();
        this.estimatedRate.destroy();
        this.currencyIcon.destroy();
        this.currencyTitle.destroy();
        this.warningText.destroy();
        this.warningBlock.destroy();
        this.qrCodeBlock.destroy();
        this.addressBlock.destroy();

        this.input = null;
        this.minAmount = null;
        this.divider = null;
        this.estimatedRate = null;
        this.currencyIcon = null;
        this.currencyTitle = null;
        this.warningText = null;
        this.warningBlock = null;
        this.qrCodeBlock = null;
        this.addressBlock = null;
        this.rates = null;

        super.destroy();
    }
}