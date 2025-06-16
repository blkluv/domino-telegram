import {Point, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../GameEvents";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {WheelTimer} from "./wheel_info_block/WheelTimer";


export class WheelInfoBlock extends Sprite {
    private lotteryText: LanguageText;
    private winCoinsText: LanguageText;
    private spinButton: Button;
    timer: WheelTimer;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.lotteryText = new LanguageText({key: "WheelWindow/Lottery", fontSize: 124, fill: 0xFFCF23});
        this.winCoinsText = new LanguageText({key: "WheelWindow/WinCoins", fontSize: 47, fill: 0xEABAFF});
        this.spinButton = new Button({
            callback: this.onSpinButtonClick.bind(this),
            bgTextureName: "common/active_button",
            bgCornersSize: 20,
            bgSizes: new Point(370, 146),
            textKey: "WheelWindow/Spin",
            fontSize: 64,
            textPosition: new Point(0, -2),
            oneTimeOnly: true
        });
        this.timer = new WheelTimer();
    }

    addChildren(): void {
        this.addChild(this.lotteryText);
        this.addChild(this.winCoinsText);
        this.addChild(this.spinButton);
        this.addChild(this.timer);
    }

    initChildren(): void {
        this.lotteryText.setTextStroke(0xD43111, 6);
        this.winCoinsText.setTextShadow(0x7501E5, 0, 20);
        this.spinButton.languageText.setTextStroke(0x308B0F, 4);

        Pivot.center(this.lotteryText);
        Pivot.center(this.winCoinsText);

        this.lotteryText.y = -220;
        this.winCoinsText.y = -90;
        this.spinButton.y = 50;
        this.timer.y = 170;
    }

    onSpinButtonClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.WHEEL_SPIN));
    }

    activate(value: boolean): void {
        if (value) {
            this.spinButton.enabled = true;
            this.spinButton.languageText.style.fill = 0xffffff;
            this.spinButton.languageText.setTextStroke(0x308B0F, 4);
            this.timer.visible = false;
        } else {
            this.spinButton.makeGreyAndDisabled("common/grey_button", 20);
        }
    }

    destroy(): void {
        this.removeChild(this.lotteryText);
        this.removeChild(this.winCoinsText);
        this.removeChild(this.spinButton);

        this.lotteryText.destroy();
        this.winCoinsText.destroy();
        this.spinButton.destroy();

        this.lotteryText = null;
        this.winCoinsText = null;
        this.spinButton = null;

        super.destroy();
    }
}
