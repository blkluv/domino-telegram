import {Button, Pivot, PlatformService} from "@azur-games/pixi-vip-framework";
import {Point, Sprite} from "pixi.js";
import {DominoGame} from "../../../app";
import {BaseScreen} from "./BaseScreen";
import {ScreenType} from "./ScreenType";
import {GuestLoginButton} from "./welcome_screen/GuestLoginButton";


export class WelcomeScreen extends BaseScreen {
    private loginComplete: Function;
    private googleLogin: Button;
    private appleLogin: Button;
    private facebookLogin: Button;
    private guestLogin: GuestLoginButton;
    private scaleContainer: Sprite;

    constructor() {
        super(ScreenType.WELCOME);
        this.createChildren();
        this.addChildren();
        this.onGameScaleChanged();
    }

    private createChildren(): void {
        this.googleLogin = new Button({
            callback: this.onGoogleLoginClick.bind(this),
            bgTextureName: "common/white_btn",
            bgCornersSize: 40,
            bgSizes: new Point(460, 76),
            iconTextureName: "common/icon_google",
            iconPosition: new Point(-150),
            textKey: "LoginWindow/google",
            fontSize: 32,
            fontColor: 0,
            fontWeight: "600",
            textPosition: new Point(30, -2),
            autoFitWidth: 300
        });
        this.appleLogin = new Button({
            callback: this.onAppleLoginClick.bind(this),
            bgTextureName: "common/white_btn",
            bgCornersSize: 40,
            bgSizes: new Point(460, 76),
            iconTextureName: "common/icon_apple",
            iconPosition: new Point(-150),
            textKey: "LoginWindow/apple",
            fontSize: 32,
            fontColor: 0,
            fontWeight: "600",
            textPosition: new Point(30, -2),
            autoFitWidth: 300
        });
        this.facebookLogin = new Button({
            callback: this.onFacebookLoginClick.bind(this),
            bgTextureName: "common/blue_btn",
            bgCornersSize: 40,
            bgSizes: new Point(460, 76),
            iconTextureName: "common/icon_facebook",
            iconPosition: new Point(-190),
            textKey: "LoginWindow/facebook",
            fontSize: 32,
            fontWeight: "600",
            textPosition: new Point(30, -2),
            autoFitWidth: 400
        });
        this.guestLogin = new GuestLoginButton(this.onGuestLoginClick.bind(this));
        this.scaleContainer = new Sprite();
    }

    private addChildren(): void {
        this.addChild(this.scaleContainer);
        this.scaleContainer.addChild(this.googleLogin);
        this.scaleContainer.addChild(this.appleLogin);
        this.scaleContainer.addChild(this.facebookLogin);
        this.scaleContainer.addChild(this.guestLogin);
    }

    private async onGuestLoginClick(): Promise<void> {
        await PlatformService.onClickGuestLoginButton();
        this.loginComplete();
    }

    private async onGoogleLoginClick(): Promise<void> {
        await PlatformService.onClickGoogleLoginButton();
        this.loginComplete();
    }

    private async onAppleLoginClick(): Promise<void> {
        await PlatformService.onClickAppleLoginButton();
        this.loginComplete();
    }

    private async onFacebookLoginClick(): Promise<void> {
        let success: boolean = await PlatformService.onClickFacebookLoginButton();
        success && this.loginComplete();
    }

    async waitForLogin(): Promise<void> {
        await new Promise(resolve => this.loginComplete = resolve);
    }

    onGameScaleChanged(): void {
        let verticalScreen: boolean = DominoGame.instance.screenH > DominoGame.instance.screenW;
        if (verticalScreen) {
            this.scaleContainer.scale.set(DominoGame.instance.screenH / DominoGame.instance.screenW * 1.2);
            Pivot.center(this.scaleContainer);

            this.googleLogin.x = this.appleLogin.x = this.facebookLogin.x = this.guestLogin.x = 0;
            this.guestLogin.y = DominoGame.instance.screenH / (DominoGame.instance.screenH / DominoGame.instance.screenW * 2.7);
            this.googleLogin.y = this.guestLogin.y - 150;
            this.appleLogin.y = this.googleLogin.y - 120;
            this.facebookLogin.y = this.appleLogin.y - 120;
        } else {
            this.scaleContainer.scale.set(1);
            Pivot.center(this.scaleContainer);

            this.googleLogin.y = this.appleLogin.y = this.facebookLogin.y = DominoGame.instance.screenH / 3.2;
            this.guestLogin.y = DominoGame.instance.screenH / 2.4;
            this.googleLogin.x = 500;
            this.facebookLogin.x = -500;
        }
    }

    destroy(): void {
        this.scaleContainer.removeChild(this.facebookLogin);
        this.scaleContainer.removeChild(this.appleLogin);
        this.scaleContainer.removeChild(this.googleLogin);
        this.scaleContainer.removeChild(this.guestLogin);
        this.removeChild(this.scaleContainer);

        this.facebookLogin.destroy();
        this.appleLogin.destroy();
        this.googleLogin.destroy();
        this.guestLogin.destroy();
        this.scaleContainer.destroy();

        this.facebookLogin = null;
        this.appleLogin = null;
        this.googleLogin = null;
        this.guestLogin = null;
        this.scaleContainer = null;
        this.loginComplete = null;

        super.destroy();
    }

}
