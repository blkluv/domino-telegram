import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Tab} from "@azur-games/pixi-vip-framework";
import {TabData} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {ProfileTabsNames} from "./ProfileTabsNames";


export class ProfileTab extends Tab<ProfileTabsNames> {
    constructor(public data: TabData<ProfileTabsNames>, public onTabClickEventName: string) {
        super(data, onTabClickEventName);
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.activeTitleText = new LanguageText({key: this.data.titleTextKey, fill: 0x7B7872, fontSize: 34});
        this.inactiveBackground = DisplayObjectFactory.createSprite("profile/switcher_slider");
    }

    addChildren(): void {
        this.addChild(this.inactiveBackground).alpha = .00001;
        this.addChild(this.activeTitleText);
    }

    initChildren(): void {
        Pivot.center(this.inactiveBackground);
        Pivot.center(this.activeTitleText);
    }
}
