import {Sprite} from "pixi.js";
import {Tabs} from "@azur-games/pixi-vip-framework";
import {TabData} from "@azur-games/pixi-vip-framework";
import {Direction} from "@azur-games/pixi-vip-framework";
import {TabsOptions} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../GameEvents";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {ProfileTab} from "./profile_tabs/ProfileTab";
import {ProfileTabsNames} from "./profile_tabs/ProfileTabsNames";


export class ProfileTabs extends Tabs<ProfileTab, ProfileTabsNames> {
    protected activeTabBackground: Sprite;
    private background: Sprite;

    constructor() {
        let tabsConfig: TabData<ProfileTabsNames>[] = [
            {titleTextKey: "Profile/Statistics", name: ProfileTabsNames.STATISTICS, initialActive: true},
            {titleTextKey: "Profile/Trophies", name: ProfileTabsNames.TROPHIES, enabled: false},
            {titleTextKey: "Profile/Achievement", name: ProfileTabsNames.ACHIEVEMENT, enabled: false},
        ];
        let options: TabsOptions = {direction: Direction.HORIZONTAL, animated: true, betweenItems: 285};
        super(tabsConfig.map(config => new ProfileTab(config, GameEvents.PROFILE_TAB_CLICKED)), options);
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("profile/switcher_bg");
        this.activeTabBackground = DisplayObjectFactory.createSprite("profile/switcher_slider");
    }

    addChildren(): void {
        this.addChildAt(this.background, 0);
        this.addChildAt(this.activeTabBackground, 1);
    }

    initChildren(): void {
        Pivot.center(this.background);
        Pivot.center(this.activeTabBackground);
        this.background.x = 285;
    }

    destroy(): void {
        this.removeChild(this.activeTabBackground);
        this.removeChild(this.background);

        this.activeTabBackground.destroy();
        this.background.destroy();

        this.activeTabBackground = null;
        this.background = null;

        super.destroy();
    }

}