import {NineSlicePlane, Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class SettingsTutorialPageFooter extends Sprite {
    private background: NineSlicePlane;
    private selectTutorialText: LanguageText;
    private tutorialIcon: Sprite;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("settings/footer_bg", 23, 32, 23, 32);
        this.selectTutorialText = new LanguageText({key: "Settings/SelectTutorial", fill: 0xB79973, fontSize: 33});
        this.tutorialIcon = DisplayObjectFactory.createSprite("settings/icon_tutorial_2");
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.selectTutorialText);
        this.addChild(this.tutorialIcon);
    }

    initChildren(): void {
        this.background.width = 1142;

        Pivot.center(this.background);
        Pivot.center(this.selectTutorialText);
        Pivot.center(this.tutorialIcon);

        this.tutorialIcon.x = -this.selectTutorialText.width / 2 - 50;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.selectTutorialText);
        this.removeChild(this.tutorialIcon);

        this.background.destroy();
        this.selectTutorialText.destroy();
        this.tutorialIcon.destroy();

        this.background = null;
        this.selectTutorialText = null;
        this.tutorialIcon = null;

        super.destroy();
    }
}
