import {DisplayObjectFactory, Pivot, Button, PlatformService, TonRates, TelegramApi} from "@azur-games/pixi-vip-framework";
import {TextInput} from "pixi-textinput-v5";
import {NineSlicePlane, Point, Sprite, Text} from "pixi.js";
import {Settings} from "../../../../../../Settings";


export class CurrencyInput extends Sprite {
    private maxDigitsLength: number = 5;
    private maxDecimalLength: number = 8;
    private rates: TonRates;
    background: NineSlicePlane;
    focusBackground: NineSlicePlane;
    input: TextInput;
    depositButton: Button;

    constructor(private callback: (inputValue: number) => void) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("deposit/deposit_input_bg", 30, 30, 30, 30);
        this.focusBackground = DisplayObjectFactory.createNineSlicePlane("deposit/deposit_stages_frame", 30, 30, 30, 30);
        this.input = new TextInput({
            multiline: false,
            input: {
                multiline: false,
                fontSize: "36px",
                fontFamily: Settings.COMMISSIONER,
                fontWeight: "400",
                padding: "40px",
                width: "900px",
                color: "#ffffff",
                height: "0px",
                textAlign: "left",
                rows: 1
            },
        });
        this.input.on("input", this.tryToInput.bind(this), this);
        this.input.on("focus", this.handleFocus.bind(this, true), this);
        this.input.on("blur", this.handleFocus.bind(this, false), this);

        this.depositButton = new Button({
            callback: this.deposit.bind(this),
            bgTextureName: "common/green_button",
            bgSizes: new Point(960, 94),
            bgCornersSize: 34,
            textKey: "Deposit",
            fontSize: 40,
            fontWeight: "400",
            textPosition: new Point(0, -6),
        });
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.focusBackground);
        this.addChild(this.input);
        this.addChild(this.depositButton);
    }

    initChildren(): void {
        //@ts-ignore
        this.input.placeholder = "Enter TON amount";
        this.input._placeholderColor = 0x38508C;
        this.background.width = this.focusBackground.width = 960;
        this.background.height = this.focusBackground.height = 94;
        Pivot.center(this.background);
        Pivot.center(this.focusBackground);
        Pivot.center(this.input);
        this.depositButton.y = 130;
    }

    handleFocus(focus: boolean): void {
        this.focusBackground.visible = focus;
        this.background.visible = !focus;
    }

    tryToInput(value: string): void {
        const [digits, decimals] = value.split(".");
        if (digits.length > this.maxDigitsLength || decimals.length > this.maxDecimalLength) {
            let inputText = this.input.children.find(child => child instanceof Text) as Text;
            //@ts-ignore
            this.input.text = inputText.text.substr(0, value.length - 1);
        }
        const cleanValue = value.replace(/[^\d+\.?\d*$]/, '');
        //@ts-ignore
        this.input.text = cleanValue;
        console.log(cleanValue);
        this.callback(parseFloat(cleanValue));
    }

    deposit() {
        console.log("deposit --> ", this.input.text.toString());
        const coins = (parseFloat(this.input.text.toString()) * this.rates.inUsdtToCoin * this.rates.ton2usdt).toFixed();
        (PlatformService.platformApi as TelegramApi).tonDeposit(coins);
    }

    applyData(rates: TonRates) {
        this.rates = rates;
    }

    destroy(): void {
        super.destroy();
        this.removeChild(this.background);
        this.removeChild(this.input);
        this.removeChild(this.depositButton);
        this.removeChild(this.focusBackground);

        this.background.destroy();
        this.input.destroy();
        this.depositButton.destroy();
        this.focusBackground.destroy();

        this.background = null;
        this.input = null;
        this.depositButton = null;
        this.focusBackground = null;
        this.rates = null;
    }

}
