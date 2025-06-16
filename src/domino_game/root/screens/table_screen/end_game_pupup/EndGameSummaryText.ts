import {Sprite, Text} from "pixi.js";
import {TextFactory} from "../../../../../factories/TextFactory";
import {LanguageService} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class EndGameSummaryText extends Sprite {
    text: Text;
    private text2: Text;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.setValue(LanguageService.getTextByKey("EndGameWindow/summary"));
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
        this.text = TextFactory.createCommissioner({fontSize: 44, fill: 0x024f71});
        this.text2 = TextFactory.createCommissioner({fontSize: 44});
    }

    private addChildren() {
        this.addChild(this.text);
        this.addChild(this.text2);
    }

    private initChildren() {
        this.text.style.stroke = 0x024f71;
        this.text.style.strokeThickness = 12;
        this.text.y = 4;

        this.text2.style.stroke = 0x08679d;
        this.text2.style.strokeThickness = 12;

    }
}