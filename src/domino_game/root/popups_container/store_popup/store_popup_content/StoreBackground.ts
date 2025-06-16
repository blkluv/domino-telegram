import {NineSlicePlane, Sprite} from "pixi.js";
import {DominoGame} from "../../../../../app";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Settings} from "../../../../../Settings";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class StoreBackground extends Sprite {
    private bottomBackground: NineSlicePlane;
    private topBackground: Sprite;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
    }

    createChildren(): void {
        this.bottomBackground = DisplayObjectFactory.createNineSlicePlane("store/bg_bottom", 10, 10, 10, 10);
        this.topBackground = DisplayObjectFactory.createSprite("store/bg_top");
    }

    addChildren(): void {
        this.addChild(this.bottomBackground).alpha = .6;
        this.addChild(this.topBackground);
    }

    onGameScaleChanged(): void {
        this.bottomBackground.width = DominoGame.instance.screenW;
        this.bottomBackground.height = DominoGame.instance.screenH;
        this.topBackground.scale.set(DominoGame.instance.screenW / Settings.RESOURCES_WIDTH * 6, DominoGame.instance.screenH / Settings.RESOURCES_HEIGHT * 6);
        Pivot.center(this.bottomBackground);
        Pivot.center(this.topBackground);
    }

    destroy(): void {
        this.removeChild(this.bottomBackground);
        this.removeChild(this.topBackground);

        this.bottomBackground.destroy();
        this.topBackground.destroy();

        this.bottomBackground = null;
        this.topBackground = null;

        super.destroy();
    }

}
