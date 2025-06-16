import {DisplayObjectFactory, Pivot} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Sprite} from "pixi.js";
import {AvatarsListTitle} from "./avatars_list/AvatarsListTitle";
import {AvatarsList} from "./AvatarsList";


export class AvatarBlock extends Sprite {
    private background: NineSlicePlane;
    private avatarsListTitle: AvatarsListTitle;
    private avatarsList: AvatarsList;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("edit_profile/avatars_bg_shadow", 270, 270, 270, 270);
        this.avatarsListTitle = new AvatarsListTitle();
        this.avatarsList = new AvatarsList();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.avatarsListTitle);
        this.addChild(this.avatarsList);
    }

    initChildren(): void {
        this.background.height = 700;
        this.background.width = 800;

        Pivot.center(this.background);

        this.avatarsList.x = -20;
        this.avatarsList.y = -300;
        this.background.y = 200;
        this.avatarsListTitle.y = -400;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.avatarsListTitle);
        this.removeChild(this.avatarsList);

        this.background.destroy();
        this.avatarsListTitle.destroy();
        this.avatarsList.destroy();

        this.background = null;
        this.avatarsListTitle = null;
        this.avatarsList = null;

        super.destroy();
    }
}
