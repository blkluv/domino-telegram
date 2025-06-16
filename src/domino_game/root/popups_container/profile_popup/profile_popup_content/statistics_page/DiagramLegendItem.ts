import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class DiagramLegendItem extends Sprite {
    private background: Sprite;
    private text: LanguageText;

    constructor(private textKey: string = "Profile/You", private bgTextureKey: string = "profile/legend_blue") {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite(this.bgTextureKey);
        this.text = new LanguageText({key: this.textKey, fontSize: 24, fill: 0xA99673});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.text);
    }

    initChildren(): void {
        Pivot.center(this.background);
        Pivot.center(this.text, false, true);
        this.text.x = 40;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.text);

        this.background.destroy();
        this.text.destroy();

        this.background = null;
        this.text = null;

        super.destroy();
    }
}
