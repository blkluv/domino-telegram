import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../GameEvents";
import {PlatformName} from "@azur-games/pixi-vip-framework";
import {PlatformService} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {SignInButton} from "./sign_in_buttons/SignInButton";


export class SignInButtons extends Sprite {
    private background: NineSlicePlane;
    private buttons: SignInButton[];
    private updateButtonsBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.createButtons();
        this.updateButtonsBindThis = this.updateButtons.bind(this);
        addEventListener(GameEvents.PROFILE_UPDATED, this.updateButtonsBindThis);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("settings/social_buttons_bg", 80, 87, 80, 87);
    }

    addChildren(): void {
        this.addChild(this.background);
    }

    initChildren(): void {
        this.background.width = 950;
        this.background.height = 130;
        Pivot.center(this.background);
    }

    updateButtons(): void {
        this.destroyButtons();
        this.createButtons();
    }

    createButtons(): void {
        this.buttons = [];
        PlatformService.platformApi.platformName == PlatformName.FACEBOOK_WEB || this.buttons.push(new SignInButton(this.onFbButtonClick.bind(this), "common/ButtonBlue", "settings/icon_facebook"));
        PlatformService.platformApi.platformName == PlatformName.GOOGLE_WEB || this.buttons.push(new SignInButton(this.onGoogleButtonClick.bind(this), "common/ButtonGreen", "settings/icon_google"));
        PlatformService.platformApi.platformName == PlatformName.APPLE_WEB || this.buttons.push(new SignInButton(this.onAppleButtonClick.bind(this), "common/ButtonGrey", "settings/icon_apple", new Point(-90, -5)));

        this.buttons.forEach((button, i) => {
            this.addChild(button);
            button.backgroundImage.width = this.buttons.length == 2 ? 410 : 276;
            Pivot.center(button.backgroundImage);
            let margin: number = button.backgroundWidth + (this.buttons.length == 2 ? 80 : 40);
            button.x = margin * i - margin * (this.buttons.length - 1) / 2;
        });
    }

    async onFbButtonClick(): Promise<void> {
        let success: boolean = await PlatformService.onClickFacebookLoginButton();
        success && await PlatformService.processSignIn();
    }

    async onGoogleButtonClick(): Promise<void> {
        await PlatformService.onClickGoogleLoginButton();
        await PlatformService.processSignIn();
    }

    async onAppleButtonClick(): Promise<void> {
        await PlatformService.onClickAppleLoginButton();
        await PlatformService.processSignIn();
    }

    destroyButtons(): void {
        while (this.buttons.length) {
            let button: SignInButton = this.buttons.shift();
            this.removeChild(button);
            button.destroy();
        }
        this.buttons = null;
    }

    destroy(): void {
        removeEventListener(GameEvents.PROFILE_UPDATED, this.updateButtonsBindThis);
        this.updateButtonsBindThis = null;

        this.destroyButtons();
        this.removeChild(this.background);
        this.background.destroy();
        this.background = null;

        super.destroy();
    }
}
