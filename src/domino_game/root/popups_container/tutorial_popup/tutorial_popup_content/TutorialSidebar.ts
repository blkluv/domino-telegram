import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {TutorialSidebarTabs} from "./tutorial_sidebar/TutorialSidebarTabs";


export class TutorialSidebar extends Sprite {
    private howToPlayText: LanguageText;
    private background: Sprite;
    private tabs: TutorialSidebarTabs;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.howToPlayText = new LanguageText({key: "TutorialWindow/how-to-play", fontSize: 36, fill: 0xDFC1FF});
        this.background = DisplayObjectFactory.createSprite("friends/bg_menu");
        this.tabs = new TutorialSidebarTabs();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.tabs);
        this.addChild(this.howToPlayText);
    }

    initChildren(): void {
        this.howToPlayText.setTextStroke(0x784CA8, 4);
        Pivot.center(this.background);
        this.tabs.y = -80;
        this.howToPlayText.y = -220;
    }

    destroy(): void {
        this.removeChild(this.howToPlayText);
        this.removeChild(this.background);
        this.removeChild(this.tabs);

        this.howToPlayText.destroy();
        this.background.destroy();
        this.tabs.destroy();

        this.howToPlayText = null;
        this.background = null;
        this.tabs = null;

        super.destroy();
    }
}
