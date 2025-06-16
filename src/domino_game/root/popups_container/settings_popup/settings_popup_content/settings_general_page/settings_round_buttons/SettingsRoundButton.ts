import {Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class SettingsRoundButton extends Sprite {
    private bottomLayer: Sprite;
    private button: Button;

    constructor(private callback: Function, private iconTextureName: string, active: boolean,) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.button.enabled = !!callback;
        this.activate(active);
    }

    createChildren(): void {
        this.bottomLayer = DisplayObjectFactory.createSprite("settings/button_bottom_layer");
        this.button = new Button({callback: this.callback});
    }

    addChildren(): void {
        this.addChild(this.bottomLayer);
        this.addChild(this.button);
    }

    initChildren(): void {
        Pivot.center(this.bottomLayer);
    }

    activate(value: boolean): void {
        this.button.changeIcon(this.iconTextureName + (value ? "" : "_off"));
        this.button.changeBackgroundImage("settings/button_round_blue" + (value ? "" : "1"));
    }

    destroy(): void {
        this.removeChild(this.bottomLayer);
        this.bottomLayer.destroy();
        this.bottomLayer = null;
        super.destroy();
    }

}
