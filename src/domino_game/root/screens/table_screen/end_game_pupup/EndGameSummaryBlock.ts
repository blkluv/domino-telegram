import {Sprite, Text} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class EndGameSummaryBlock extends Sprite {
    private icon: Sprite;
    private value: Text;

    constructor(private iconTextureName: string, private textGradientBottom: number, private textStrokeColor: number, reward: number) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.setPointsValue(reward);
    }

    destroy() {
        this.removeChild(this.icon);
        this.removeChild(this.value);

        this.icon.destroy();
        this.value.destroy();

        this.icon = undefined;
        this.value = undefined;

        super.destroy();
    }

    private createChildren() {
        this.icon = DisplayObjectFactory.createSprite(this.iconTextureName);
        this.value = TextFactory.createCommissioner({
            fontSize: 38,
            fill: [0xffffff, this.textGradientBottom],
        });
    }

    private addChildren() {
        this.addChild(this.icon);
        this.addChild(this.value).y = 70;
    }

    private initChildren() {
        Pivot.center(this.icon);

        this.value.style.stroke = this.textStrokeColor;
        this.value.style.strokeThickness = 4;
    }

    private setPointsValue(value: number) {
        this.value.text = value;
        Pivot.center(this.value);
    }
}