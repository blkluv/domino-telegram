import {Sprite, Text} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class DominosLeft extends Sprite {
    private icon: Sprite;
    private text: Text;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.setValue(0);
    }

    private createChildren() {
        this.icon = DisplayObjectFactory.createSprite("table/sit/dominoes_left");
        this.text = TextFactory.createCommissioner({
            fontSize: 30,
            fill: 0xFEF2D7,
        });
    }

    private addChildren() {
        this.addChild(this.icon);
        this.addChild(this.text);
    }

    private initChildren() {
        Pivot.center(this.icon);
        this.text.y = -3;
        this.text.style.stroke = 0x855435;
        this.text.style.strokeThickness = 4;
    }

    setValue(value: number): void {
        this.visible = !!value;
        this.text.text = value;
        Pivot.center(this.text);
    }

    destroy() {
        this.removeChild(this.icon);
        this.removeChild(this.text);

        this.icon.destroy();
        this.text.destroy();

        this.icon = undefined;
        this.text = undefined;

        super.destroy();
    }
}