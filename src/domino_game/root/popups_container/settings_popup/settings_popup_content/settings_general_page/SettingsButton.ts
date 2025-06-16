import {NineSlicePlane, Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class SettingsButton extends Button {
    private bottomLayer: NineSlicePlane;

    constructor(callback: Function, iconTextureName: string, textKey: string) {
        super({
            callback,
            iconTextureName,
            textKey,
            bgTextureName: "common/ButtonViolet",
            bgSizes: new Point(400, 94),
            bgCornersSize: 60,
            iconPosition: new Point(-140, 0),
            fontSize: 44,
            textPosition: new Point(10, -3),
        });
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.bottomLayer = DisplayObjectFactory.createNineSlicePlane("settings/button_bottom_layer", 98, 98, 98, 98);
    }

    addChildren(): void {
        this.addChildAt(this.bottomLayer, 0);
    }

    initChildren(): void {
        this.languageText.setTextShadow();
        this.bottomLayer.width = 437;
        this.bottomLayer.height = 130;
        Pivot.center(this.bottomLayer);
    }

    destroy(): void {
        this.removeChild(this.bottomLayer);
        this.bottomLayer.destroy();
        this.bottomLayer = null;
        super.destroy();
    }
}
