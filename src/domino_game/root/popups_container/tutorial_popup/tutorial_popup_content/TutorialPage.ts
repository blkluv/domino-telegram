import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../GameEvents";

import {Pivot} from "@azur-games/pixi-vip-framework";
import {LabelColor, StateLabel} from "../../../screens/table_screen/state_labels/StateLabel";
import {TutorialHeaderTabsNames} from "./tutorial_header_tabs/TutorialHeaderTabsNames";
import {TutorialList} from "./tutorial_page/TutorialList";
import {TutorialListItem} from "./tutorial_page/TutorialListItem";
import {TutorialPageConfig, TutorialPageElementsConfig} from "./tutorial_page/TutorialPageConfig";
import {TutorialSidebarTabNames} from "./tutorial_sidebar/tutorial_sidebar_tabs/TutorialSidebarTabNames";


export class TutorialPage extends Sprite {
    private background: NineSlicePlane;
    private onTutorialModeChangeBindThis: (e: MessageEvent) => void;
    private onTutorialPhaseChangeBindThis: (e: MessageEvent) => void;
    private config: Map<TutorialHeaderTabsNames, Map<TutorialSidebarTabNames, TutorialPageConfig>>;
    private mode: TutorialHeaderTabsNames = TutorialHeaderTabsNames.CLASSIC;
    private phase: TutorialSidebarTabNames = TutorialSidebarTabNames.MOVE;
    list: TutorialList;

    constructor() {
        super();
        this.createConfig();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.updatePage();

        this.onTutorialModeChangeBindThis = this.onTutorialModeChange.bind(this);
        this.onTutorialPhaseChangeBindThis = this.onTutorialPhaseChange.bind(this);
        addEventListener(GameEvents.TUTORIAL_GAME_MODE_CHOSEN, this.onTutorialModeChangeBindThis);
        addEventListener(GameEvents.TUTORIAL_GAME_PHASE_CHOSEN, this.onTutorialPhaseChangeBindThis);
    }

    createStateLabel(color: LabelColor, text: string): StateLabel {
        let stateLabel: StateLabel = new StateLabel(color, text);
        Pivot.center(stateLabel);
        stateLabel.show();
        stateLabel.scale.set(.55);
        return stateLabel;
    }

    createText(key: string): LanguageText {
        let text: LanguageText = new LanguageText({key, fontSize: 36, fill: 0x8EFD59, align: "left"});
        text.setTextStroke(0x0DA73A, 4, false);
        return text;
    }

    createConfig(): void {
        let kingEndGameElements: TutorialPageElementsConfig[] = [{
            element: this.createStateLabel(LabelColor.DARK, "TableMessages/Factor1"),
            position: new Point(450, 55)
        }, {
            element: this.createStateLabel(LabelColor.BLUE, "TableMessages/Factor2"),
            position: new Point(450, 610)
        }, {
            element: this.createStateLabel(LabelColor.BLUE, "TableMessages/Factor3"),
            position: new Point(450, 1165)
        }, {
            element: this.createStateLabel(LabelColor.BLUE, "TableMessages/Factor4"),
            position: new Point(450, 1725)
        }, {
            element: this.createStateLabel(LabelColor.BLUE, "TableMessages/Factor5"),
            position: new Point(450, 2285)
        }];

        let classicRoundEndElements: TutorialPageElementsConfig[] = [{
            element: this.createText("TutorialWindow/tiles-placed"),
            position: new Point(570, 180)
        }];

        let classicPointsElements: TutorialPageElementsConfig[] = [{
            element: this.createText("TutorialWindow/total-points"),
            position: new Point(500, 290)
        }];

        let fivesPointsElements: TutorialPageElementsConfig[] = [{
            element: this.createText("TutorialWindow/five-points"),
            position: new Point(550, 310)
        }, {
            element: this.createText("TutorialWindow/total-points"),
            position: new Point(500, 690)
        }];

        let fivesMoveElements: TutorialPageElementsConfig[] = [{
            element: this.createText("TableMessages/Spinner"),
            position: new Point(580, 860)
        }];

        this.config = new Map();
        this.config.set(TutorialHeaderTabsNames.CLASSIC, new Map());
        this.config.get(TutorialHeaderTabsNames.CLASSIC).set(TutorialSidebarTabNames.MOVE, {imageName: "tutorial/classic_move"});
        this.config.get(TutorialHeaderTabsNames.CLASSIC).set(TutorialSidebarTabNames.ROUND_END, {imageName: "tutorial/classic_round_end", elements: classicRoundEndElements});
        this.config.get(TutorialHeaderTabsNames.CLASSIC).set(TutorialSidebarTabNames.POINTS, {imageName: "tutorial/classic_points", elements: classicPointsElements});
        this.config.get(TutorialHeaderTabsNames.CLASSIC).set(TutorialSidebarTabNames.GAME_END, {imageName: "tutorial/classic_game_end"});
        this.config.set(TutorialHeaderTabsNames.BLOCK, new Map());
        this.config.get(TutorialHeaderTabsNames.BLOCK).set(TutorialSidebarTabNames.MOVE, {imageName: "tutorial/block_move"});
        this.config.get(TutorialHeaderTabsNames.BLOCK).set(TutorialSidebarTabNames.ROUND_END, {imageName: "tutorial/classic_round_end", elements: classicRoundEndElements});
        this.config.get(TutorialHeaderTabsNames.BLOCK).set(TutorialSidebarTabNames.POINTS, {imageName: "tutorial/classic_points", elements: classicPointsElements});
        this.config.get(TutorialHeaderTabsNames.BLOCK).set(TutorialSidebarTabNames.GAME_END, {imageName: "tutorial/classic_game_end"});
        this.config.set(TutorialHeaderTabsNames.FIVES, new Map());
        this.config.get(TutorialHeaderTabsNames.FIVES).set(TutorialSidebarTabNames.MOVE, {imageName: "tutorial/fives_move", elements: fivesMoveElements});
        this.config.get(TutorialHeaderTabsNames.FIVES).set(TutorialSidebarTabNames.ROUND_END, {imageName: "tutorial/classic_round_end", elements: classicRoundEndElements});
        this.config.get(TutorialHeaderTabsNames.FIVES).set(TutorialSidebarTabNames.POINTS, {imageName: "tutorial/fives_points", elements: fivesPointsElements});
        this.config.get(TutorialHeaderTabsNames.FIVES).set(TutorialSidebarTabNames.GAME_END, {imageName: "tutorial/classic_game_end"});
        this.config.set(TutorialHeaderTabsNames.KING, new Map());
        this.config.get(TutorialHeaderTabsNames.KING).set(TutorialSidebarTabNames.MOVE, {imageName: "tutorial/classic_move"});
        this.config.get(TutorialHeaderTabsNames.KING).set(TutorialSidebarTabNames.ROUND_END, {imageName: "tutorial/classic_round_end", elements: classicRoundEndElements});
        this.config.get(TutorialHeaderTabsNames.KING).set(TutorialSidebarTabNames.POINTS, {imageName: "tutorial/king_mode_points"});
        this.config.get(TutorialHeaderTabsNames.KING).set(TutorialSidebarTabNames.GAME_END, {imageName: "tutorial/king_mode_end_game", elements: kingEndGameElements});
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("friends/page_bg", 30, 30, 30, 30);
        this.list = new TutorialList();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.list);
    }

    initChildren(): void {
        this.background.width = 985;
        this.background.height = 652;
        Pivot.center(this.background);
        this.list.y = -280;
    }

    onTutorialModeChange(e: MessageEvent): void {
        if (this.list.dragged) {
            return;
        }
        this.mode = e.data.name;
        this.updatePage();
    }

    onTutorialPhaseChange(e: MessageEvent): void {
        if (this.list.dragged) {
            return;
        }
        this.phase = e.data.name;
        this.updatePage();
    }

    updatePage(): void {
        this.createConfig();
        let item: TutorialListItem = new TutorialListItem(this.config.get(this.mode).get(this.phase));
        this.list.clear();
        this.list.addToList(item, 0, item.background.height);
        this.list.scrollToTop(false);
    }

    destroy(): void {
        removeEventListener(GameEvents.TUTORIAL_GAME_MODE_CHOSEN, this.onTutorialModeChangeBindThis);
        removeEventListener(GameEvents.TUTORIAL_GAME_PHASE_CHOSEN, this.onTutorialPhaseChangeBindThis);
        this.onTutorialModeChangeBindThis = null;
        this.onTutorialPhaseChangeBindThis = null;

        this.removeChild(this.background);
        this.removeChild(this.list);
        this.background.destroy();
        this.list.destroy();
        this.background = null;
        this.list = null;

        this.config.clear();
        this.config = null;
        this.phase = null;
        this.mode = null;

        super.destroy();
    }
}
