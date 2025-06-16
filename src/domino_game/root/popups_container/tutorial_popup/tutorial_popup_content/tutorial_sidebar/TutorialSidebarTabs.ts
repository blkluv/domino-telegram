import {NineSlicePlane} from "pixi.js";
import {Tabs} from "@azur-games/pixi-vip-framework";
import {TabData} from "@azur-games/pixi-vip-framework";
import {Direction} from "@azur-games/pixi-vip-framework";
import {TabsOptions} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../GameEvents";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {TutorialSidebarTab} from "./tutorial_sidebar_tabs/TutorialSidebarTab";
import {TutorialSidebarTabNames} from "./tutorial_sidebar_tabs/TutorialSidebarTabNames";


export class TutorialSidebarTabs extends Tabs<TutorialSidebarTab, TutorialSidebarTabNames> {
    protected activeTabBackground: NineSlicePlane;

    constructor() {
        let tabsConfig: TabData<TutorialSidebarTabNames>[] = [
            {titleTextKey: "TutorialWindow/move", name: TutorialSidebarTabNames.MOVE, initialActive: true},
            {titleTextKey: "TutorialWindow/round-end", name: TutorialSidebarTabNames.ROUND_END},
            {titleTextKey: "TutorialWindow/points", name: TutorialSidebarTabNames.POINTS},
            {titleTextKey: "TutorialWindow/game-end", name: TutorialSidebarTabNames.GAME_END},
        ];
        let options: TabsOptions = {direction: Direction.VERTICAL, animated: false, betweenItems: 110};
        super(tabsConfig.map(config => new TutorialSidebarTab(config, GameEvents.TUTORIAL_GAME_PHASE_CHOSEN)), options);
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.activeTabBackground = DisplayObjectFactory.createNineSlicePlane("common/active_button", 20, 20, 20, 20);
    }

    addChildren(): void {
        this.addChildAt(this.activeTabBackground, 0);
    }

    initChildren(): void {
        this.activeTabBackground.width = 320;
        this.activeTabBackground.height = 100;
        Pivot.center(this.activeTabBackground);
    }

    destroy(): void {
        super.destroy();
    }
}
