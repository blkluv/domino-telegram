import {DisplayObjectFactory, Pivot} from "@azur-games/pixi-vip-framework";
import {BLEND_MODES, NineSlicePlane, Sprite,} from "pixi.js";


export class ListBlurEdge extends Sprite {
    private background: NineSlicePlane;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("edit_profile/mask_blur_edge", 1, 29, 1, 29);

    }

    addChildren(): void {
        this.addChild(this.background);

    }

    initChildren(): void {
        this.background.blendMode = BLEND_MODES.ERASE;
        this.background.width = 800;
        this.background.height = 200;
        Pivot.center(this.background);
    }

    destroy(): void {
        this.removeChild(this.background);
        this.background.destroy();
        this.background = null;

        super.destroy();
    }
}
