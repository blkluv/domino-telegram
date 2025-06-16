import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {NumberUtils} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class Balance extends Sprite {
    private _skipBalanceUpdate: boolean;
    private background: NineSlicePlane;
    private icon: Sprite;
    private plusButton: Button;
    private balanceText: LanguageText;
    private onBalanceUpdateBindThis: (e: MessageEvent) => void;

    constructor(private callback: Function = null) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.plusButton.enabled = !!this.callback;
        this.onBalanceUpdateBindThis = this.onBalanceUpdate.bind(this);
        addEventListener(GameEvents.PROFILE_UPDATED, this.onBalanceUpdateBindThis);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("lobby/balance_bg", 24, 24, 24, 24);
        this.icon = DisplayObjectFactory.createSprite("common/currency_soft_crown");
        this.plusButton = new Button({
            callback: this.callback,
            bgTextureName: "lobby/btn_hud_plus",
            bgCornersSize: 24,
            bgSizes: new Point(56, 56),
            iconTextureName: "lobby/icon_plus",
            iconPosition: new Point(0, -1),
            disabledOffline: true,
            dimWhenDisabled: true
        });
        this.balanceText = new LanguageText({
            //key: NumberUtils.priceFormat(DynamicData?.myProfile?.coins || 0),
            key: NumberUtils.coinsKiloFormat(DynamicData?.myProfile?.coins || 0),
            fontSize: 33,
            autoFitWidth: 115
        });
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.icon);
        this.addChild(this.balanceText);
        this.addChild(this.plusButton);
    }

    initChildren(): void {
        this.background.width = 214;
        this.background.height = 57;

        Pivot.center(this.background);
        Pivot.center(this.icon);
        Pivot.center(this.balanceText);

        this.icon.scale.set(.56);
        this.icon.y = -1;

        this.plusButton.x = 90;
        this.icon.x = -90;

        this.balanceText.y = -2;
    }

    onBalanceUpdate(): void {
        if (this._skipBalanceUpdate) {
            return;
        }
        this.update(DynamicData.myProfile.coins);
    }

    update(amount: number): void {
        this.balanceText.changeText(NumberUtils.coinsKiloFormat(amount));
    }

    set skipBalanceUpdate(value: boolean) {
        this._skipBalanceUpdate = value;
    }

    destroy(): void {
        removeEventListener(GameEvents.PROFILE_UPDATED, this.onBalanceUpdateBindThis);
        this.onBalanceUpdateBindThis = null;
        this.removeChild(this.background);
        this.removeChild(this.icon);
        this.removeChild(this.plusButton);
        this.removeChild(this.balanceText);

        this.background.destroy();
        this.icon.destroy();
        this.plusButton.destroy();
        this.balanceText.destroy();

        this.background = null;
        this.icon = null;
        this.plusButton = null;
        this.balanceText = null;

        super.destroy();
    }
}