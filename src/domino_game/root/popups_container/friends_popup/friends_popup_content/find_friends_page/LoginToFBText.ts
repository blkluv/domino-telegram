import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Language} from "@azur-games/pixi-vip-framework";
import {SettingsService} from "../../../../../../services/SettingsService";


export class LoginToFBText extends Sprite {
    private orText: LanguageText;
    private logInToFBText: LanguageText;
    private toSeeYourFriendsText: LanguageText;
    private margin: number = 16;
    private maxWidth: number = 800;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.orText = new LanguageText({key: "FriendWindow.or", fontSize: 42, fill: 0xCBB282,});
        this.logInToFBText = new LanguageText({key: "FriendWindow.login-to-facebook", fontSize: 42, fill: 0x98855F});
        this.toSeeYourFriendsText = new LanguageText({key: "FriendWindow.to-see-your-friends", fontSize: 42, fill: 0xCBB282});
    }

    addChildren(): void {
        this.addChild(this.orText);
        this.addChild(this.logInToFBText);
        this.addChild(this.toSeeYourFriendsText);
    }

    initChildren(): void {
        this.orText.anchor.set(0, .5);
        this.logInToFBText.anchor.set(0, .5);
        this.toSeeYourFriendsText.anchor.set(0, .5);

        this.logInToFBText.x = this.orText.width + this.margin;
        this.toSeeYourFriendsText.x = this.logInToFBText.x + this.logInToFBText.width + this.margin;

        let overallWidth: number = this.orText.width + this.logInToFBText.width + this.toSeeYourFriendsText.width + (this.margin * 2);
        if (overallWidth > this.maxWidth) {
            this.scale.set(this.maxWidth / overallWidth);
        }
        this.x = -Math.min(overallWidth, this.maxWidth) / 2;
    }

    destroy(): void {
        this.removeChild(this.orText);
        this.removeChild(this.logInToFBText);
        this.removeChild(this.toSeeYourFriendsText);

        this.orText.destroy();
        this.logInToFBText.destroy();
        this.toSeeYourFriendsText.destroy();

        this.orText = null;
        this.logInToFBText = null;
        this.toSeeYourFriendsText = null;

        super.destroy();
    }
}
