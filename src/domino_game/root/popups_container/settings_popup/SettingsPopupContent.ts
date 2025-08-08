import {Sprite} from "pixi.js";
import {GameEvents} from "../../../../GameEvents";
import {PopupBody} from "../PopupBody";
import {SettingsGeneralPage} from "./settings_popup_content/SettingsGeneralPage";
import {SettingsLanguagePage} from "./settings_popup_content/SettingsLanguagePage";
import {SettingsPage} from "./settings_popup_content/SettingsPage";


;

export class SettingsPopupContent extends Sprite {
    private body: PopupBody;
    private currentPage: Sprite;
    private onPageChangeBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.body = new PopupBody(this.onClose.bind(this), "Settings/Title", this.onBackButtonClick.bind(this));
        this.currentPage = new SettingsGeneralPage();
        this.onPageChangeBindThis = this.onPageChange.bind(this);
        addEventListener(GameEvents.SETTING_PAGE_CHANGE, this.onPageChangeBindThis);
    }

    addChildren(): void {
        this.addChild(this.body);
        this.addChild(this.currentPage);
    }

    initChildren(): void {
        this.body.showBackButton(false);
    }

    onPageChange(e: MessageEvent): void {
        let page: SettingsPage = e.data;
        this.clearPage();

        switch (page) {
            case SettingsPage.GENERAL:
                this.currentPage = new SettingsGeneralPage();
                break;
            case SettingsPage.LANGUAGE:
                this.currentPage = new SettingsLanguagePage();
                break;
        }

        this.addChild(this.currentPage);
        this.body.showBackButton(page != SettingsPage.GENERAL);
    }

    onBackButtonClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.SETTING_PAGE_CHANGE, {data: SettingsPage.GENERAL}));
    }

    onClose(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_SETTINGS_POPUP));
    }

    clearPage(): void {
        this.removeChild(this.currentPage);
        this.currentPage.destroy();
        this.currentPage = null;
    }

    destroy(): void {
        removeEventListener(GameEvents.SETTING_PAGE_CHANGE, this.onPageChangeBindThis);
        this.onPageChangeBindThis = null;

        this.clearPage();

        this.removeChild(this.body);
        this.body.destroy();
        this.body = null;

        super.destroy();
    }
}
