import {DisplayObjectFactory, LanguageText, Pivot} from "@azur-games/pixi-vip-framework";
import {Sprite} from "pixi.js";


export class AvatarsListTitle extends Sprite {
    private icon: Sprite;
    private titleText: LanguageText;
    private titleTextSecondStroke: LanguageText;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.icon = DisplayObjectFactory.createSprite("edit_profile/profile_icon");
        this.titleText = new LanguageText({key: "AVATARS", fontSize: 60, fill: [0xFFF7EB, 0xE8CCA5]});
        this.titleTextSecondStroke = new LanguageText({key: "AVATARS", fontSize: 60});
    }

    addChildren(): void {
        this.addChild(this.icon);
        this.addChild(this.titleTextSecondStroke);
        this.addChild(this.titleText);
    }

    initChildren(): void {
        this.titleText.setTextStroke(0x8E617F, 4);
        this.titleTextSecondStroke.setTextStroke(0x4A2D50, 8);

        Pivot.center(this.icon);
        Pivot.center(this.titleText);
        Pivot.center(this.titleTextSecondStroke);

        this.icon.x = -this.titleText.width / 2 - this.icon.width / 2 - 20;
    }

    destroy(): void {
        this.removeChild(this.icon);
        this.removeChild(this.titleText);
        this.removeChild(this.titleTextSecondStroke);

        this.icon.destroy();
        this.titleText.destroy();
        this.titleTextSecondStroke.destroy();

        this.icon = null;
        this.titleText = null;
        this.titleTextSecondStroke = null;

        super.destroy();
    }
}
