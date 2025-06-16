import {Sprite, Text} from "pixi.js";
import {TextFactory} from "../../../../../../factories/TextFactory";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class EndGameScoreText extends Sprite {
    text: Text;
    private text2: Text;

    constructor(private align: TextAlign) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    destroy() {
        this.removeChild(this.text);
        this.text.destroy();
        this.text = undefined;

        super.destroy();
    }

    setValue(value: string): void {
        this.text.text = value;
        this.text2.text = value;

        Pivot.center(this.text);
        Pivot.center(this.text2);
    }

    private createChildren() {
        this.text = TextFactory.createCommissioner({fontSize: 140, fill: 0xfef3d7});
        this.text2 = TextFactory.createCommissioner({fontSize: 140, fill: 0xfef3d7});
    }

    private addChildren() {
        this.addChild(this.text);
        this.addChild(this.text2);
    }

    private initChildren() {
        this.text.style.stroke = 0x2d024f;
        this.text.style.strokeThickness = 12;
        this.text2.style.stroke = 0x7105c5;
        this.text2.style.strokeThickness = 4;
        this.text2.style.fill = [0xFFFFFF, 0x90a2ab];
    }
}

export enum TextAlign {
    CENTER,
    LEFT,
    RIGHT
}