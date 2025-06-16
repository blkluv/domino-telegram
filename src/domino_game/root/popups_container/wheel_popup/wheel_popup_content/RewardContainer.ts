import {TweenMax, Linear} from "gsap";
import {Graphics, Point, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {ScreenCovering} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GraphicsFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../GameEvents";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Timeout} from "@azur-games/pixi-vip-framework";
import {Shine} from "./Shine";


export class RewardContainer extends ScreenCovering {
    private alphaTween: TweenMax;
    private background: Sprite;
    private rewardText: LanguageText;
    private rewardTextDoubleStroke: LanguageText;
    private coinsAmountText: LanguageText;
    private claimButton: Button;
    private shine: Shine;
    private shineMask: Graphics;
    private coinsAmount: number;
    coinIcon: Sprite;

    constructor() {
        super(.3);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.alpha = 0;
        this.interactive = this.interactiveChildren = false;
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("wheel/reward_art");
        this.rewardText = new LanguageText({key: "REWARD", fill: [0xFFFFFF, 0x91A2AB], fontSize: 110});
        this.rewardTextDoubleStroke = new LanguageText({key: "REWARD", fill: [0xFFFFFF, 0x91A2AB], fontSize: 110});
        this.coinsAmountText = new LanguageText({key: "", fontSize: 100, fill: [0xFFF500, 0xFF9B05]});
        this.coinIcon = DisplayObjectFactory.createSprite("common/currency_soft_crown");
        this.claimButton = new Button({
            callback: this.onClaim.bind(this),
            bgTextureName: "common/blue_button",
            bgSizes: new Point(420, 120),
            bgCornersSize: 32,
            textKey: "WheelRewardWindow/Claim",
            fontSize: 50,
            textPosition: new Point(0, -2),
            oneTimeOnly: true
        });
        this.shine = new Shine("wheel/blue_light", "wheel/reward_star");
        this.shineMask = GraphicsFactory.createRect(-450, 0, 900, 600);
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.rewardTextDoubleStroke);
        this.addChild(this.rewardText);
        this.addChild(this.shine).show(true);
        this.addChild(this.shineMask);
        this.addChild(this.coinsAmountText);
        this.addChild(this.coinIcon);
        this.addChild(this.claimButton);
    }

    initChildren(): void {
        this.shine.mask = this.shineMask;
        this.rewardTextDoubleStroke.setTextStroke(0x2D024F, 12);
        this.rewardText.setTextStroke(0x7D04DC, 4);
        this.coinsAmountText.setTextStroke(0x0047BB, 3);
        this.coinsAmountText.setTextShadow(0, 4, 0, undefined, .38);
        this.claimButton.languageText.setTextStroke(0x0F6D8B, 4);

        Pivot.center(this.background);
        Pivot.center(this.coinIcon);

        this.background.y = -350;
        this.rewardText.y = this.rewardTextDoubleStroke.y = -225;
        this.shine.y = this.shineMask.y = -133;
        this.shine.x = this.shineMask.x = -20;

        this.coinsAmountText.y = -50;
        this.coinsAmountText.x = 30;
        this.coinIcon.y = -44;
        this.coinIcon.x = -140;
        this.claimButton.y = 300;

    }

    show(coinsAmount: number): void {
        this.coinsAmount = coinsAmount;
        this.interactive = this.interactiveChildren = true;
        this.coinsAmountText.changeText(this.coinsAmount.toString());
        this.alphaTween = TweenMax.to(this, .3, {alpha: 1, ease: Linear.easeNone});
    }

    async onClaim(): Promise<void> {
        dispatchEvent(new MessageEvent(GameEvents.ON_CLAIM_COINS, {data: {startPosition: new Point(this.coinIcon.x, this.coinIcon.y), coinsAmount: this.coinsAmount}}));
        await Timeout.seconds(3);
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_WHEEL_POPUP));
    }

    destroy(): void {
        this.alphaTween?.kill();
        this.alphaTween = null;

        this.removeChild(this.background);
        this.removeChild(this.rewardText);
        this.removeChild(this.rewardTextDoubleStroke);
        this.removeChild(this.shine);
        this.removeChild(this.shineMask);
        this.removeChild(this.coinsAmountText);
        this.removeChild(this.coinIcon);
        this.removeChild(this.claimButton);

        this.background.destroy();
        this.rewardText.destroy();
        this.rewardTextDoubleStroke.destroy();
        this.shine.destroy();
        this.shineMask.destroy();
        this.coinsAmountText.destroy();
        this.coinIcon.destroy();
        this.claimButton.destroy();

        this.background = null;
        this.rewardText = null;
        this.rewardTextDoubleStroke = null;
        this.shine = null;
        this.shineMask = null;
        this.coinsAmountText = null;
        this.coinIcon = null;
        this.claimButton = null;

        super.destroy();
    }
}
