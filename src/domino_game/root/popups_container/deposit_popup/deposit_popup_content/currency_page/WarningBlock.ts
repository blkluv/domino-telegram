import {Sprite, NineSlicePlane} from "pixi.js";
import {DisplayObjectFactory, LanguageText, Pivot} from "@azur-games/pixi-vip-framework";


export class WarningBlock extends Sprite {
    private background: NineSlicePlane;
    private warningIcon: Sprite;
    private warningText: LanguageText;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("deposit/red_bg", 20, 20, 20, 20);
        this.warningIcon = DisplayObjectFactory.createSprite("deposit/attention_sign"); // Will be styled as warning icon
        this.warningText = new LanguageText({
            key: "This is a temporary deposit address and it will be expired in 180 mins",
            fontSize: 26,
            fill: 0xF1F3FF,
            fontWeight: "400"
        });
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.warningIcon);
        this.addChild(this.warningText);
    }

    initChildren() {
        // Setup background
        this.background.width = 960;
        this.background.height = 133;
        Pivot.center(this.background);

        // Style warning icon (rotate to make it look like an exclamation or warning symbol)
        Pivot.center(this.warningIcon);
        this.warningIcon.x = -400;
        this.warningIcon.y = 0;

        // Position warning text
        Pivot.center(this.warningText, false);
        this.warningText.x = -350;
        this.warningText.y = -15;

        // Enable word wrapping for long text
        this.warningText.style.wordWrap = true;
        this.warningText.style.wordWrapWidth = 700;
    }

    destroy() {
        this.removeChild(this.background);
        this.removeChild(this.warningIcon);
        this.removeChild(this.warningText);

        this.background.destroy();
        this.warningIcon.destroy();
        this.warningText.destroy();

        this.background = null;
        this.warningIcon = null;
        this.warningText = null;

        super.destroy();
    }
}