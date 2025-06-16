import {Sprite} from "pixi.js";
import {GameEvents} from "../../../../GameEvents";
import {BigPopupBody} from "../friends_popup/friends_popup_content/BigPopupBody";
import {TutorialPage} from "./tutorial_popup_content/TutorialPage";
import {TutorialHeaderTabs} from "./tutorial_popup_content/TutorialHeaderTabs";
import {TutorialSidebar} from "./tutorial_popup_content/TutorialSidebar";


export class TutorialPopupContent extends Sprite {
    private body: BigPopupBody;
    private sidebar: TutorialSidebar;
    private headerTabs: TutorialHeaderTabs;
    private tutorialPage: TutorialPage;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.body = new BigPopupBody(this.onClose.bind(this), "");
        this.sidebar = new TutorialSidebar();
        this.headerTabs = new TutorialHeaderTabs();
        this.tutorialPage = new TutorialPage();
    }

    addChildren(): void {
        this.addChild(this.body);
        this.addChild(this.sidebar);
        this.addChild(this.headerTabs);
        this.addChild(this.tutorialPage);
    }

    initChildren(): void {
        this.sidebar.x = -488;
        this.sidebar.y = 14;
        this.headerTabs.y = -310;
        this.headerTabs.x = -570;
        this.tutorialPage.x = 180;
        this.tutorialPage.y = 12;
    }

    onClose(): void {
        if (this.tutorialPage.list.dragged) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_TUTORIAL_POPUP));
    }

    destroy(): void {
        this.removeChild(this.body);
        this.removeChild(this.sidebar);
        this.removeChild(this.headerTabs);
        this.removeChild(this.tutorialPage);

        this.body.destroy();
        this.sidebar.destroy();
        this.headerTabs.destroy();
        this.tutorialPage.destroy();

        this.body = null;
        this.sidebar = null;
        this.headerTabs = null;
        this.tutorialPage = null;

        super.destroy();
    }
}
