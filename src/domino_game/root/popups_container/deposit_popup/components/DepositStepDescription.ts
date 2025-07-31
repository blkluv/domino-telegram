import {DisplayObjectFactory, LanguageText, Pivot} from "@azur-games/pixi-vip-framework";
import {Sprite} from "pixi.js";


export class DepositStepDescription extends Sprite {
    private background: Sprite;
    private stepText: LanguageText;
    private stepDescriptionText: LanguageText;

    constructor(private stepTextValue: string, private stepDescriptionValue: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("deposit/deposit_stages_step_icon");
        this.stepText = new LanguageText({key: this.stepTextValue, fontSize: 24, fontWeight: "400"});
        this.stepDescriptionText = new LanguageText({key: this.stepDescriptionValue, fontSize: 32, fontWeight: "400", fill: "0x7BA2FF"});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.stepText);
        this.addChild(this.stepDescriptionText);
    }

    initChildren(): void {
        Pivot.center(this.stepText);
        Pivot.center(this.background);
        Pivot.center(this.stepDescriptionText, false);
        this.stepText.y = -2;
        this.stepDescriptionText.x = 60;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.stepText);
        this.removeChild(this.stepDescriptionText);

        this.background.destroy();
        this.stepText.destroy();
        this.stepDescriptionText.destroy();

        this.background = null;
        this.stepText = null;
        this.stepDescriptionText = null;

        super.destroy();
    }
}
