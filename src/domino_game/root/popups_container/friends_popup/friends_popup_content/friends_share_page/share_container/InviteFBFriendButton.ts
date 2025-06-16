import {Button, DisplayObjectFactory, LanguageText, Pivot, PlatformName, PlatformService, Timeout} from "@azur-games/pixi-vip-framework";
import {InteractionEvent, Point, Sprite} from "pixi.js";


export class InviteFBFriendButton extends Button {
    private coins: Sprite;
    private fbIcon: Sprite;
    private inviteAFriendText: LanguageText;
    private coinsText: LanguageText;

    constructor() {
        super({
            bgTextureName: "friends/bg_facebook",
            bgSizes: new Point(344, 80),
            bgCornersSize: 30,
        });
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.coins = DisplayObjectFactory.createSprite("friends/coins");
        this.fbIcon = DisplayObjectFactory.createSprite("friends/icon_facebook");
        this.inviteAFriendText = new LanguageText({key: "Friends/InviteAFriend", fontSize: 25, autoFitWidth: 200});
        this.coinsText = new LanguageText({key: "Coins", fill: 0xFFC600, fontSize: 34, placeholders: ["500"]});
    }

    addChildren() {
        this.addChild(this.coins);
        this.addChild(this.fbIcon);
        this.addChild(this.inviteAFriendText);
        this.addChild(this.coinsText);
    }

    initChildren() {
        this.coinsText.setTextStroke(0x0047BB, 3);

        Pivot.center(this.coins);
        Pivot.center(this.fbIcon);
        Pivot.center(this.inviteAFriendText);

        this.coins.x = 150;
        this.fbIcon.x = -115;
        this.inviteAFriendText.y = -18;
        this.inviteAFriendText.x = 10;
        this.coinsText.y = 12;
    }

    async processClick(e: InteractionEvent): Promise<void> {
        this.playSound();

        if ([PlatformName.FACEBOOK_WEB, PlatformName.FACEBOOK].includes(PlatformService.platformApi.platformName)) {
            PlatformService.platformApi.share();
        } else {
            let success: boolean = await PlatformService.onClickFacebookLoginButton();
            success && await PlatformService.processSignIn();
            await Timeout.seconds(1);
            await PlatformService.platformApi.share();
        }
    }

    destroy() {
        this.removeChild(this.coins);
        this.removeChild(this.fbIcon);
        this.removeChild(this.inviteAFriendText);
        this.removeChild(this.coinsText);

        this.coins.destroy();
        this.fbIcon.destroy();
        this.inviteAFriendText.destroy();
        this.coinsText.destroy();

        this.coins = null;
        this.fbIcon = null;
        this.inviteAFriendText = null;
        this.coinsText = null;

        super.destroy();
    }
}