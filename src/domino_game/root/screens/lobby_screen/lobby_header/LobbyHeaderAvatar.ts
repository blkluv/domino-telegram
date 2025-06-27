import {Graphics, Point, Sprite} from "pixi.js";
import {Button, DisplayObjectFactory, GraphicsFactory, Pivot} from "../../../../../../../pixi-vip-framework";


export class LobbyHeaderAvatar extends Button {
    avatarSize: number = 146;
    private avatarImage: Sprite;
    private avatarMask: Graphics;
    private editIcon: Sprite;

    constructor() {
        super({
            bgTextureName: "lobby/avatar_bg",
            bgCornersSize: 36,
            bgSizes: new Point(160, 160)
        });
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.editIcon = DisplayObjectFactory.createSprite("lobby/edit_icon");
        this.avatarMask = GraphicsFactory.createRoundedRect(0, 0, this.avatarSize, this.avatarSize, 32);
    }

    addChildren(): void {
        this.addChild(this.editIcon);
        this.addChild(this.avatarMask);
    }

    initChildren(): void {
        this.editIcon.x = 35;
        this.editIcon.y = 35;
        Pivot.center(this.avatarMask);
        this.backgroundImage.y = 4;
    }

    setAvatar(avatarTextureName: string) {
        this.tryDestroyAvatar();
        this.avatarImage = DisplayObjectFactory.createSprite(avatarTextureName, this.avatarSize);
        this.addChildAt(this.avatarImage, 1);
        this.avatarImage.mask = this.avatarMask;
        Pivot.center(this.avatarImage);
    }

    tryDestroyAvatar(): void {
        if (!this.avatarImage) {
            return;
        }
        this.avatarImage.visible = false;
        this.removeChild(this.avatarImage);
        this.avatarImage.destroy();
        this.avatarImage = null;
    }

    destroy(): void {
        this.tryDestroyAvatar();
        this.removeChild(this.avatarMask);
        this.removeChild(this.editIcon);
        this.avatarMask.destroy();
        this.editIcon.destroy();
        this.avatarMask = null;
        this.editIcon = null;
        super.destroy();
    }

}
