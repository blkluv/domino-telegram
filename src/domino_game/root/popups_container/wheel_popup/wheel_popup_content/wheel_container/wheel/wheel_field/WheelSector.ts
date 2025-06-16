import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class WheelSector extends Sprite {
    private text: LanguageText;
    private icon: Sprite;

    constructor(private textKey: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.text = new LanguageText({key: this.textKey, fontSize: 33});
        this.icon = DisplayObjectFactory.createSprite("common/currency_soft_crown");
    }

    addChildren(): void {
        this.addChild(this.text);
        this.addChild(this.icon);
    }

    initChildren(): void {
        this.text.setTextStroke(0x974FBD, 5);
        this.icon.scale.set(.4);

        Pivot.center(this.text);
        Pivot.center(this.icon);

        this.icon.x = -10;
        this.text.x = 60;
    }

    destroy(): void {
        this.removeChild(this.text);
        this.removeChild(this.icon);

        this.text.destroy();
        this.icon.destroy();

        this.text = null;
        this.icon = null;

        super.destroy();
    }
}
