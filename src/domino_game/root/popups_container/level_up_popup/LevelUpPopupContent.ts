import {Elastic} from "gsap";
import {Spine} from "pixi-spine";
import {Graphics, NineSlicePlane, Point, Sprite} from "pixi.js";
import {AppearType} from "@azur-games/pixi-vip-framework";
import {AppearanceContainer} from "@azur-games/pixi-vip-framework";
import {ClaimCoins} from "../../../../common/ClaimCoins";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GraphicsFactory} from "@azur-games/pixi-vip-framework";
import {SpineFactory} from "../../../../factories/SpineFactory";
import {GameEvents} from "../../../../GameEvents";
import {LevelUpEventMessage} from "../../../../services/socket_service/socket_message_data/user_events_message/LevelUpEventMessage";
import {SocketService} from "../../../../services/SocketService";
import {UserEventsService} from "../../../../services/UserEventsService";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Shine} from "../wheel_popup/wheel_popup_content/Shine";


export class LevelUpPopupContent extends AppearanceContainer {
    private spine: Spine;
    private levelBadge: Sprite;
    private levelText: LanguageText;
    private levelUpTextBg: NineSlicePlane;
    private levelUpText: LanguageText;
    private shine: Shine;
    private shineMask: Graphics;
    private rewardText: LanguageText;
    private coinsAmountText: LanguageText;
    private coinIcon: Sprite;
    private claimCoins: ClaimCoins;

    constructor(private eventMessageData: LevelUpEventMessage) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.appearChildren();

        SocketService.viewMessage([this.eventMessageData.id]);
        setTimeout(() => this.claimReward(), 2000);
    }

    async appearChildren(): Promise<void> {

        this.registerAppear(this.levelBadge, {
            appearType: AppearType.SCALE_IN,
            ease: Elastic.easeInOut,
            startValue: 0,
            duration: 1.5,
            delay: 0
        });
        this.appear();
    }

    createChildren(): void {
        this.spine = SpineFactory.createLevelUpSpine();
        this.levelBadge = DisplayObjectFactory.createSprite("level_up/lvl_badge");
        this.levelText = new LanguageText({key: this.eventMessageData.body.level.toString(), fontSize: 122});
        this.levelUpTextBg = DisplayObjectFactory.createNineSlicePlane("level_up/gradient", 600, 18, 600, 18);
        this.levelUpText = new LanguageText({key: "LevelUpWindow/title", fontSize: 120, fill: [0xFEFFC6, 0xFCFF62, 0xFFC708, 0xF08801]});
        this.shine = new Shine("wheel/blue_light", "wheel/reward_star");
        this.shineMask = GraphicsFactory.createRect(-450, 0, 900, 600);
        this.rewardText = new LanguageText({key: "LevelUpWindow/reward", fontSize: 40});
        this.coinsAmountText = new LanguageText({key: this.eventMessageData.body.coins.toString(), fontSize: 92, fill: [0xFFF500, 0xFF9B05]});
        this.coinIcon = DisplayObjectFactory.createSprite("common/currency_soft_crown");
        this.claimCoins = new ClaimCoins();
    }

    addChildren(): void {
        this.addChild(this.shine).show(true);
        this.addChild(this.shineMask);
        this.addChild(this.levelUpTextBg);
        this.addChild(this.levelUpText);
        this.addChild(this.levelBadge);
        this.addChild(this.spine);
        this.addChild(this.levelText);
        this.addChild(this.rewardText);
        this.addChild(this.coinsAmountText);
        this.addChild(this.coinIcon);
        this.addChild(this.claimCoins);
    }

    initChildren(): void {
        this.shine.mask = this.shineMask;

        this.levelUpTextBg.width = 1280;
        this.levelUpTextBg.height = 186;

        this.spine.scale.set(.6);
        this.coinIcon.scale.set(.8);

        this.levelText.setTextStroke(0xC288A, 8);
        this.levelUpText.setTextStroke(0xDF914B, 8);
        this.levelUpText.setTextShadow(0x5F2D00, 8, 0);
        this.rewardText.setTextStroke(0x08679D, 6);
        this.rewardText.setTextShadow(0x024F71, 3, 0, undefined, 1);
        this.coinsAmountText.setTextStroke(0x0047BB, 3, false);
        this.coinsAmountText.setTextShadow(0, 4, 0, undefined, .38, false);

        Pivot.center(this.levelBadge);
        Pivot.center(this.levelUpTextBg);
        Pivot.center(this.coinsAmountText, false);
        Pivot.center(this.coinIcon);

        this.levelBadge.y = -290;
        this.spine.y = -290;
        this.levelText.y = -310;
        this.levelUpTextBg.y = -92;
        this.levelUpText.y = -96;
        this.rewardText.y = 30;
        this.coinsAmountText.y = 110;
        this.coinIcon.y = 113;
        this.coinsAmountText.x = -20;
        this.coinIcon.x = -80;
    }

    close(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_LEVEL_UP_POPUP));
        UserEventsService.checkLevelUpMessage(true);
    }

    claimReward(): void {
        dispatchEvent(new MessageEvent(GameEvents.ON_CLAIM_COINS, {
            data: {
                startPosition: new Point(this.coinIcon.x, this.coinIcon.y),
                coinsAmount: this.eventMessageData.body.coins,
                onComplete: this.close.bind(this)
            }
        }));
    }

    destroy(): void {
        this.spine.state.timeScale = 0;
        this.removeChild(this.spine);
        this.removeChild(this.levelBadge);
        this.removeChild(this.levelText);
        this.removeChild(this.levelUpTextBg);
        this.removeChild(this.levelUpText);
        this.removeChild(this.shine);
        this.removeChild(this.shineMask);
        this.removeChild(this.rewardText);
        this.removeChild(this.coinsAmountText);
        this.removeChild(this.coinIcon);
        this.removeChild(this.claimCoins);

        this.spine.destroy();
        this.levelBadge.destroy();
        this.levelText.destroy();
        this.levelUpTextBg.destroy();
        this.levelUpText.destroy();
        this.shine.destroy();
        this.shineMask.destroy();
        this.rewardText.destroy();
        this.coinsAmountText.destroy();
        this.coinIcon.destroy();
        this.claimCoins.destroy();

        this.spine = null;
        this.levelBadge = null;
        this.levelText = null;
        this.levelUpTextBg = null;
        this.levelUpText = null;
        this.shine = null;
        this.shineMask = null;
        this.rewardText = null;
        this.coinsAmountText = null;
        this.coinIcon = null;
        this.claimCoins = null;

        super.destroy();
    }
}