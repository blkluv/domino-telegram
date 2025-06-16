import {Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {ProfileData} from "../../../../services/socket_service/socket_message_data/ProfileData";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {ProfileTabsNames} from "./profile_popup_content/profile_tabs/ProfileTabsNames";
import {ProfileStatisticsTabPlaceholder} from "./profile_popup_content/ProfileStatisticsTabPlaceholder";
import {StatisticsPage} from "./profile_popup_content/StatisticsPage";
import {ProfileSidebar} from "./profile_popup_content/ProfileSidebar";


export class ProfilePopupContent extends Sprite {
    private background: Sprite;
    private closeButton: Button;
    private title: LanguageText;
    private sidebar: ProfileSidebar;
    private tabs: ProfileStatisticsTabPlaceholder;
    private currentPage: StatisticsPage;
    private onTabClickedBindThis: (e: MessageEvent) => void;

    constructor(private profileData: ProfileData) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.placeCurrentPage();
        this.onTabClickedBindThis = this.onTabClicked.bind(this);
        addEventListener(GameEvents.PROFILE_TAB_CLICKED, this.onTabClickedBindThis);
        this.background.interactive = true;
    }

    createChildren() {
        this.background = DisplayObjectFactory.createSprite("profile/ProfileWindow");
        this.closeButton = new Button({callback: this.onClose.bind(this), bgTextureName: "common/button_close"});
        this.title = new LanguageText({key: "Profile/Title", fontSize: 65});
        this.sidebar = new ProfileSidebar(this.profileData);
        this.tabs = new ProfileStatisticsTabPlaceholder();
        this.currentPage = new StatisticsPage(this.profileData);
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.closeButton);
        this.addChild(this.title);
        this.addChild(this.sidebar);
        this.addChild(this.tabs);
        this.addChild(this.currentPage);
    }

    initChildren() {
        this.closeButton.scale.set(1.2);
        this.title.style.stroke = 0x9F755A;
        this.title.style.strokeThickness = 10;

        Pivot.center(this.background);
        Pivot.center(this.title);

        this.closeButton.x = 653;
        this.closeButton.y = -368;
        this.title.y = -370;
        this.sidebar.x = -505;
        // this.tabs.x = -55;
        this.tabs.x = 230;
        this.tabs.y = -220;
    }

    placeCurrentPage() {
        this.currentPage.x = 220;
        this.currentPage.y = 120;
    }

    onTabClicked(e: MessageEvent) {
        let tabName: ProfileTabsNames = e.data.name;

        this.removeChild(this.currentPage);
        this.currentPage?.destroy();
        this.currentPage = null;

        switch (tabName) {
            case ProfileTabsNames.STATISTICS:
                this.currentPage = new StatisticsPage(this.profileData);
                break;
        }
        this.addChild(this.currentPage);
        this.placeCurrentPage();
    }

    onClose() {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_PROFILE_POPUP));
    }

    destroy() {
        removeEventListener(GameEvents.PROFILE_TAB_CLICKED, this.onTabClickedBindThis);
        this.onTabClickedBindThis = null;

        this.removeChild(this.background);
        this.removeChild(this.closeButton);
        this.removeChild(this.title);
        this.removeChild(this.sidebar);
        this.removeChild(this.tabs);
        this.removeChild(this.currentPage);

        this.background.destroy();
        this.closeButton.destroy();
        this.title.destroy();
        this.sidebar.destroy();
        this.tabs.destroy();
        this.currentPage.destroy();

        this.background = null;
        this.closeButton = null;
        this.title = null;
        this.sidebar = null;
        this.tabs = null;
        this.currentPage = null;

        super.destroy();
    }
}