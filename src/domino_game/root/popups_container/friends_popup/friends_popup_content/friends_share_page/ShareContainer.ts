import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {InviteFBFriendButton} from "./share_container/InviteFBFriendButton";
import {ShareSocialButtons} from "./share_container/ShareSocialButtons";


export class ShareContainer extends Sprite {
    private itsMoreFunText: LanguageText;
    private inviteToJoinText: LanguageText;
    private playTogetherText: LanguageText;
    private inviteFBFriendButton: InviteFBFriendButton;
    private socialsButtons: ShareSocialButtons;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.itsMoreFunText = new LanguageText({key: "Friends/ItsMoreFun", fill: 0xFCE136, fontStyle: "italic", fontSize: 47, fontWeight: "900", autoFitWidth: 680});
        this.inviteToJoinText = new LanguageText({key: "Friends/InviteToJoin", fontSize: 26, fontWeight: "600"});
        this.playTogetherText = new LanguageText({key: "Friends/PlayTogether", fontSize: 26, fontWeight: "700", fill: 0x1061C6});
        this.inviteFBFriendButton = new InviteFBFriendButton();
        this.socialsButtons = new ShareSocialButtons();
    }

    addChildren(): void {
        this.addChild(this.itsMoreFunText);
        this.addChild(this.inviteToJoinText);
        this.addChild(this.playTogetherText);
        this.addChild(this.inviteFBFriendButton);
        this.addChild(this.socialsButtons);
    }

    initChildren(): void {
        this.itsMoreFunText.setTextStroke(0x1E5990, 6);
        this.itsMoreFunText.setTextShadow(0x022052, 3, 0);
        this.inviteToJoinText.setTextStroke(0x0E58B2, 6);
        this.itsMoreFunText.setTextShadow(0x022052, 1, 1);

        Pivot.center(this.playTogetherText);

        this.itsMoreFunText.y = -180;
        this.inviteToJoinText.y = -90;
        this.playTogetherText.y = -57;
        this.inviteFBFriendButton.y = 15;
        this.socialsButtons.y = 170;
    }

    destroy(): void {
        this.removeChild(this.itsMoreFunText);
        this.removeChild(this.inviteToJoinText);
        this.removeChild(this.playTogetherText);
        this.removeChild(this.inviteFBFriendButton);
        this.removeChild(this.socialsButtons);

        this.itsMoreFunText.destroy();
        this.inviteToJoinText.destroy();
        this.playTogetherText.destroy();
        this.inviteFBFriendButton.destroy();
        this.socialsButtons.destroy();

        this.itsMoreFunText = null;
        this.inviteToJoinText = null;
        this.playTogetherText = null;
        this.inviteFBFriendButton = null;
        this.socialsButtons = null;

        super.destroy();
    }
}
