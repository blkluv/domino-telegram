import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Tab} from "@azur-games/pixi-vip-framework";
import {TabData} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";

import {Pivot} from "@azur-games/pixi-vip-framework";
import {TutorialSidebarTabNames} from "./TutorialSidebarTabNames";


export class TutorialSidebarTab extends Tab<TutorialSidebarTabNames> {
    constructor(public data: TabData<TutorialSidebarTabNames>, public onTabClickEventName: string) {
        super(data, onTabClickEventName);
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.activeTitleText = new LanguageText({key: this.data.titleTextKey, fontSize: 36});
        this.inactiveTitleText = new LanguageText({key: this.data.titleTextKey, fontSize: 36, fill: 0xDFC1FF});
        this.inactiveBackground = DisplayObjectFactory.createNineSlicePlane("common/static_button", 20, 20, 20, 20);
    }

    addChildren(): void {
        this.addChild(this.inactiveBackground);
        this.addChild(this.activeTitleText);
        this.addChild(this.inactiveTitleText);
    }

    initChildren(): void {
        this.inactiveBackground.width = 320;
        this.inactiveBackground.height = 100;

        this.inactiveTitleText.setTextStroke(0x744AA3, 2);
        this.activeTitleText.setTextStroke(0x308B0F, 2);

        Pivot.center(this.inactiveBackground);

        this.activeTitleText.y = this.inactiveTitleText.y = -3;
    }
}
