import {Sprite, Text} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class DealerButton extends Sprite {
    private back: Sprite;
    private dText: Text;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    destroy() {
        this.removeChild(this.back);
        this.removeChild(this.dText);

        this.back.destroy();
        this.dText.destroy();

        this.back = undefined;
        this.dText = undefined;

        super.destroy();
    }

    private createChildren() {
        this.back = DisplayObjectFactory.createSprite("table/sit/dealer_button");
        this.dText = TextFactory.createCommissioner({fontSize: 32, value: "D"});
    }

    private addChildren() {
        this.addChild(this.back);
        this.addChild(this.dText);
    }

    private initChildren() {
        Pivot.center(this.back);
        this.dText.style.stroke = 0x333333;
        this.dText.style.strokeThickness = 4;
        this.dText.y = -6;
        this.dText.x = 1;
        Pivot.center(this.dText);
    }
}