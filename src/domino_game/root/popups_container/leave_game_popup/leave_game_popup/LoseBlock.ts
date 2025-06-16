import {NineSlicePlane, Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {LoseText} from "./lose_block/LoseText";


export class LoseBlock extends Sprite {
    private background: NineSlicePlane;
    private loseText: LoseText;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("common/frame_window_inner", 64, 64, 64, 64);
        this.loseText = new LoseText();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.loseText);
    }

    initChildren(): void {
        this.background.width = 1000;
        this.background.height = 200;
        Pivot.center(this.background);
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.loseText);

        this.background.destroy();
        this.loseText.destroy();

        this.background = null;
        this.loseText = null;
        super.destroy();
    }
}
