import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Tab} from "@azur-games/pixi-vip-framework";
import {TabData} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextCaseFormat} from "@azur-games/pixi-vip-framework";
import {TutorialHeaderTabsNames} from "./TutorialHeaderTabsNames";


export class TutorialHeaderTab extends Tab<TutorialHeaderTabsNames> {
    background: Sprite;
    titleText: LanguageText;

    constructor(public data: TabData<TutorialHeaderTabsNames>, public onTabClickEventName: string) {
        super(data, onTabClickEventName);
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite(this.data.backgroundTextureName);
        this.titleText = new LanguageText({key: this.data.titleTextKey, fontSize: 36, autoFitWidth: 180, textFormat: TextCaseFormat.UPPERCASE});
    }

    get totalWidth(): number {
        return this.background.width * this.scale.x;
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.titleText);
    }

    initChildren(): void {
        this.background.anchor.set(.5, 1);

        this.titleText.style.lineHeight = 38;
        this.titleText.y = -45;

        switch (this.data.name) {
            case TutorialHeaderTabsNames.CLASSIC:
                this.titleText.style.fill = 0xA0E8EE;
                this.titleText.setTextStroke(0x10668B, 6);
                break;
            case TutorialHeaderTabsNames.BLOCK:
                this.titleText.style.fill = 0xFFFFC1;
                this.titleText.setTextStroke(0xB8630E, 6);
                break;
            case TutorialHeaderTabsNames.FIVES:
                this.titleText.style.fill = 0xC2F6A9;
                this.titleText.setTextStroke(0x2A7D0D, 6);
                break;
            case TutorialHeaderTabsNames.KING:
                this.titleText.style.fill = 0xF6B2A9;
                this.titleText.setTextStroke(0xA40707, 6);
                break;
        }
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.titleText);
        this.background.destroy();
        this.titleText.destroy();
        this.background = null;
        this.titleText = null;
        super.destroy();
    }
}
