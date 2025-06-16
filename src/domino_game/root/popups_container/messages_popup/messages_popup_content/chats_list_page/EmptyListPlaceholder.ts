import {AppearanceContainer, DisplayObjectFactory, LanguageText, Pivot} from "@azur-games/pixi-vip-framework";
import {Point, Sprite} from "pixi.js";


export class EmptyListPlaceholder extends AppearanceContainer {
    private image: Sprite;
    text: LanguageText;

    constructor(private imageTextureName: string, private textKey: string, private textPosition: Point = new Point(0, 180)) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.image = DisplayObjectFactory.createSprite(this.imageTextureName);
        this.text = new LanguageText({key: this.textKey, fill: 0x98855F, fontSize: 42, autoFitWidth: 850, centerAfterLanguageChanged: true});

    }

    addChildren(): void {
        this.addChild(this.image);
        this.addChild(this.text);
    }

    initChildren(): void {
        this.text.setTextStroke(0xEEDDBB, 6);

        Pivot.center(this.image);
        Pivot.center(this.text);

        this.text.y = this.textPosition.y;
        this.text.x = this.textPosition.x;
    }

    destroy(): void {
        this.removeChild(this.image);
        this.removeChild(this.text);

        this.image.destroy();
        this.text.destroy();

        this.image = null;
        this.text = null;

        super.destroy();
    }
}
