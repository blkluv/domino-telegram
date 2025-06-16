import {Sprite} from "pixi.js";
import {GameEvents} from "../../../../../GameEvents";
import {PlatformService} from "@azur-games/pixi-vip-framework";
import {PreloaderService} from "@azur-games/pixi-vip-framework";
import {LazyLoader} from "../../../../../services/loader_service/LazyLoader";
import {SettingsButton} from "./settings_general_page/SettingsButton";
import {SettingsFooter} from "./settings_general_page/SettingsFooter";
import {SettingsPage} from "./SettingsPage";
import {SettingsRoundButtons} from "./settings_general_page/SettingsRoundButtons";
import {SignInButtons} from "./settings_general_page/SignInButtons";


export class SettingsGeneralPage extends Sprite {
    private signInButtons: SignInButtons;
    private languageButton: SettingsButton;
    private tutorialButton: SettingsButton;
    private roundButtons: SettingsRoundButtons;
    private footer: SettingsFooter;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.signInButtons = new SignInButtons();
        this.languageButton = new SettingsButton(this.onLanguageClick.bind(this), "settings/icon_language", "Settings/Language");
        this.tutorialButton = new SettingsButton(this.onTutorialClick.bind(this), "settings/icon_tutorial", "Settings/Tutorial");
        this.roundButtons = new SettingsRoundButtons();
        this.footer = new SettingsFooter();
    }

    addChildren(): void {
        this.addChild(this.signInButtons).visible = PlatformService.platformApi.showSignInButtons;
        this.addChild(this.languageButton);
        this.addChild(this.tutorialButton);
        this.addChild(this.roundButtons);
        this.addChild(this.footer);
    }

    initChildren(): void {
        this.signInButtons.y = -110;
        this.languageButton.x = -254;
        this.tutorialButton.x = 254;
        this.languageButton.y = this.tutorialButton.y = PlatformService.platformApi.showSignInButtons ? 23 : -30;
        this.roundButtons.y = 190;
        this.roundButtons.x = -this.roundButtons.containerWidth / 2;
        this.footer.y = 350;
    }

    onLanguageClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.SETTING_PAGE_CHANGE, {data: SettingsPage.LANGUAGE}));
    }

    async onTutorialClick(): Promise<void> {
        let preloaderId: number = PreloaderService.show();
        await LazyLoader.waitForLazyResources();
        PreloaderService.hide(preloaderId);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_TUTORIAL_POPUP));
    }

    destroy(): void {
        this.removeChild(this.signInButtons);
        this.removeChild(this.languageButton);
        this.removeChild(this.tutorialButton);
        this.removeChild(this.roundButtons);
        this.removeChild(this.footer);

        this.signInButtons.destroy();
        this.languageButton.destroy();
        this.tutorialButton.destroy();
        this.roundButtons.destroy();
        this.footer.destroy();

        this.signInButtons = null;
        this.languageButton = null;
        this.tutorialButton = null;
        this.roundButtons = null;
        this.footer = null;

        super.destroy();
    }
}
