import {NineSlicePlane, Sprite} from "pixi.js";
import {DominoGame} from "../../../../../../app";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Settings} from "../../../../../../Settings";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class WheelContainerBackground extends Sprite {
    private background: Sprite;
    private topGradient: NineSlicePlane;
    private bottomGradient: NineSlicePlane;
    private leftGradient: NineSlicePlane;
    private rightGradient: NineSlicePlane;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onGameScaleChanged();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("wheel/bg_art");
        this.topGradient = DisplayObjectFactory.createNineSlicePlane("wheel/top_gradient");
        this.bottomGradient = DisplayObjectFactory.createNineSlicePlane("wheel/bottom_gradient");
        this.leftGradient = DisplayObjectFactory.createNineSlicePlane("wheel/left_gradient");
        this.rightGradient = DisplayObjectFactory.createNineSlicePlane("wheel/right_gradient");
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.topGradient);
        this.addChild(this.bottomGradient);
        this.addChild(this.leftGradient);
        this.addChild(this.rightGradient);
    }

    initChildren(): void {
        this.topGradient.width = 1920;
        this.bottomGradient.width = 1920;
        this.leftGradient.height = 1080;
        this.rightGradient.height = 1080;

        Pivot.center(this.background);
        Pivot.center(this.topGradient, true, false);
        Pivot.center(this.bottomGradient, true, false);
        Pivot.center(this.leftGradient, false, true);
        Pivot.center(this.rightGradient, false, true);
    }

    onGameScaleChanged(): void {
        if (DominoGame.instance.screenH > Settings.RESOURCES_HEIGHT) {
            this.topGradient.height = (DominoGame.instance.screenH - Settings.RESOURCES_HEIGHT) / 2 + 10;
            this.topGradient.y = -DominoGame.instance.screenH / 2;
            this.bottomGradient.height = this.topGradient.height;
            this.bottomGradient.y = DominoGame.instance.screenH / 2 - this.bottomGradient.height;
        } else {
            this.topGradient.height = 0;
            this.bottomGradient.height = 0;
        }
        if (DominoGame.instance.screenW > Settings.RESOURCES_WIDTH) {
            let gradientWidth: number = (DominoGame.instance.screenW - Settings.RESOURCES_WIDTH) / 2 + 10;
            this.leftGradient.width = gradientWidth;
            this.leftGradient.x = -DominoGame.instance.screenW / 2;
            this.rightGradient.width = gradientWidth;
            this.rightGradient.x = DominoGame.instance.screenW / 2 - gradientWidth;
        } else {
            this.leftGradient.width = 0;
            this.rightGradient.width = 0;
        }
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.topGradient);
        this.removeChild(this.bottomGradient);
        this.removeChild(this.leftGradient);
        this.removeChild(this.rightGradient);

        this.background.destroy();
        this.topGradient.destroy();
        this.bottomGradient.destroy();
        this.leftGradient.destroy();
        this.rightGradient.destroy();

        this.background = null;
        this.topGradient = null;
        this.bottomGradient = null;
        this.leftGradient = null;
        this.rightGradient = null;
        super.destroy();
    }
}
