import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class Discount extends Sprite {
    private background: Sprite;
    private discountAmountText: LanguageText;

    constructor(private discountAmount: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("store/discount_bg");
        this.discountAmountText = new LanguageText({
            key: "-" + this.discountAmount + "%",
            fontSize: 27
        });
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.discountAmountText);
    }

    initChildren(): void {
        this.discountAmountText.setTextStroke(0x541C86, 5);

        Pivot.center(this.background);

        this.discountAmountText.y = -7;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.discountAmountText);

        this.background.destroy();
        this.discountAmountText.destroy();

        this.background = null;
        this.discountAmountText = null;

        super.destroy();
    }
}
