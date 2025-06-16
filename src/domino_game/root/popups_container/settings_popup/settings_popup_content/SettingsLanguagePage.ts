import {Sprite} from "pixi.js";
import {Language} from "@azur-games/pixi-vip-framework";
import {SettingsService} from "../../../../../services/SettingsService";
import {ChangeLanguageButton} from "./settings_language_page/ChangeLanguageButton";


export class SettingsLanguagePage extends Sprite {
    private buttons: ChangeLanguageButton[] = [];
    private xMargin: number = 500;
    private yMargin: number = 130;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.buttons = [
            "SettingsWindow/language/en",
            "SettingsWindow/language/ru",
            "SettingsWindow/language/fr",
            "SettingsWindow/language/es",
            "SettingsWindow/language/th",
            "SettingsWindow/language/vi",
            "SettingsWindow/language/in",
            "SettingsWindow/language/ms"
        ].map(key => new ChangeLanguageButton(this.onLanguageButtonClick.bind(this, key), key));
    }

    addChildren(): void {
        this.buttons.forEach(btn => this.addChild(btn));
    }

    initChildren(): void {
        this.y = 87;

        let colCount: number = 2;
        this.buttons.forEach((avatar, i) => {
            avatar.x = (i % colCount) * this.xMargin - 250;
            avatar.y = Math.floor(i / colCount) * this.yMargin - 190;
        });
    }

    onLanguageButtonClick(textKey: string): void {
        SettingsService.currentLanguage = textKey.replace("SettingsWindow/language/", "") as Language;
    }

    destroy(): void {
        let button: ChangeLanguageButton;
        while (this.buttons.length) {
            button = this.buttons.shift();
            this.removeChild(button);
            button.destroy();
        }
        this.buttons = null;

        super.destroy();
    }
}
