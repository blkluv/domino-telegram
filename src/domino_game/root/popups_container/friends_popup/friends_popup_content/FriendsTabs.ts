import {Direction, DisplayObjectFactory, Pivot, TabData, Tabs, TabsOptions} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Sprite} from "pixi.js";
import {GameEvents} from "../../../../../GameEvents";
import {FriendsTab} from "./friends_tabs/FriendsTab";
import {FriendsTabNames} from "./friends_tabs/FriendsTabNames";


export class FriendsTabs extends Tabs<FriendsTab, FriendsTabNames> {
    private background: Sprite;
    protected activeTabBackground: NineSlicePlane;

    constructor(initialActiveTabName: FriendsTabNames) {
        let tabsConfig: TabData<FriendsTabNames>[] = [
            {titleTextKey: "Friends/Title", name: FriendsTabNames.FRIENDS},
            {titleTextKey: "Friends/NewRequests", name: FriendsTabNames.NEW_REQUESTS},
            {titleTextKey: "Friends/FindFriends", name: FriendsTabNames.FIND_FRIENDS},
            //{titleTextKey: "Friends/Share", name: FriendsTabNames.SHARE},
        ];
        tabsConfig.forEach(tabData => tabData.initialActive = tabData.name == initialActiveTabName);
        let options: TabsOptions = {direction: Direction.VERTICAL, animated: false, betweenItems: 90};
        super(tabsConfig.map(config => new FriendsTab(config, GameEvents.FRIENDS_TAB_CLICKED)), options);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.setInitialActiveTab();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("friends/bg_menu");
        this.activeTabBackground = DisplayObjectFactory.createNineSlicePlane("common/active_button", 20, 20, 20, 20);
    }

    addChildren(): void {
        this.addChildAt(this.background, 0);
        this.addChildAt(this.activeTabBackground, 1);
    }

    initChildren(): void {
        this.activeTabBackground.width = 320;
        this.activeTabBackground.height = 77;

        Pivot.center(this.background, true, false);
        Pivot.center(this.activeTabBackground);

        this.background.y = -52;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.background.destroy();
        this.background = null;

        super.destroy();
    }
}
