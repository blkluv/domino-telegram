import {Tabs} from "@azur-games/pixi-vip-framework";
import {TabData} from "@azur-games/pixi-vip-framework";
import {Direction} from "@azur-games/pixi-vip-framework";
import {TabsOptions} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../GameEvents";
import {TutorialHeaderTab} from "./tutorial_header_tabs/TutorialHeaderTab";
import {TutorialHeaderTabsNames} from "./tutorial_header_tabs/TutorialHeaderTabsNames";


export class TutorialHeaderTabs extends Tabs<TutorialHeaderTab, TutorialHeaderTabsNames> {
    onTutorialHeaderTabClickedBindThis: (e: MessageEvent) => void;

    constructor() {
        let tabsConfig: TabData<TutorialHeaderTabsNames>[] = [
            {titleTextKey: "TutorialWindow/Classic", name: TutorialHeaderTabsNames.CLASSIC, backgroundTextureName: "tutorial/btn_classic", initialActive: true},
            {titleTextKey: "TutorialWindow/Block", name: TutorialHeaderTabsNames.BLOCK, backgroundTextureName: "tutorial/btn_block"},
            {titleTextKey: "TutorialWindow/Fives", name: TutorialHeaderTabsNames.FIVES, backgroundTextureName: "tutorial/btn_fives"},
            {titleTextKey: "TutorialWindow/KingMode", name: TutorialHeaderTabsNames.KING, backgroundTextureName: "tutorial/btn_king"},
        ];
        let options: TabsOptions = {direction: Direction.HORIZONTAL, animated: true, betweenItems: 0};
        super(tabsConfig.map(config => new TutorialHeaderTab(config, GameEvents.TUTORIAL_GAME_MODE_CHOSEN)), options);

        this.onTutorialHeaderTabClickedBindThis = this.onTutorialHeaderTabClicked.bind(this);
        addEventListener(GameEvents.TUTORIAL_GAME_MODE_CHOSEN, this.onTutorialHeaderTabClickedBindThis);
        this.placeTabs();
    }

    onTutorialHeaderTabClicked(): void {
        this.placeTabs();
    }

    placeTabs(): void {
        this.tabs.forEach(tab => {
            tab.scale.set(tab.active ? 1.1 : .9);
        });

        let marginBetweenTabs: number = 10;
        let totalWidth: number = 0;
        this.tabs.forEach(tab => {
            totalWidth += tab.totalWidth / 2;
            tab.x = totalWidth;
            totalWidth += marginBetweenTabs + tab.totalWidth / 2;
        });
    }

    destroy(): void {
        removeEventListener(GameEvents.TUTORIAL_GAME_MODE_CHOSEN, this.onTutorialHeaderTabClickedBindThis);
        this.onTutorialHeaderTabClickedBindThis = null;

        super.destroy();
    }
}
