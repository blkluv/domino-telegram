import {Button, DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Sprite} from "pixi.js";
import {DominoGame} from "../../../../app";
import {GameEvents} from "../../../../GameEvents";
import {Resize} from "../../../../utils/Resize";
import {AvatarBlock} from "./edit_profile_popup_content/AvatarBlock";
import {ProfileBlock} from "./edit_profile_popup_content/ProfileBlock";


export class EditProfilePopupContent extends Sprite {
    private background: Sprite;
    private closeButton: Button;
    private profileBlock: ProfileBlock;
    private avatarBlock: AvatarBlock;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onGameScaleChanged();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("edit_profile/bg");
        this.closeButton = new Button({callback: this.onClose.bind(this), bgTextureName: "common/button_close"});
        this.profileBlock = new ProfileBlock();
        this.avatarBlock = new AvatarBlock();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.closeButton);
        this.addChild(this.profileBlock);
        this.addChild(this.avatarBlock);
    }

    initChildren(): void {
        this.avatarBlock.x = -300;
        this.profileBlock.x = 500;
    }

    onClose(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_EDIT_PROFILE_POPUP));
    }

    onGameScaleChanged(): void {
        Resize.scaleBackground(this.background);
        this.closeButton.x = DominoGame.instance.screenW / 2 - 70;
        this.closeButton.y = -DominoGame.instance.screenH / 2 + 70;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.closeButton);
        this.removeChild(this.profileBlock);
        this.removeChild(this.avatarBlock);

        this.background.destroy();
        this.closeButton.destroy();
        this.profileBlock.destroy();
        this.avatarBlock.destroy();

        this.background = null;
        this.closeButton = null;
        this.profileBlock = null;
        this.avatarBlock = null;

        super.destroy();
    }
}