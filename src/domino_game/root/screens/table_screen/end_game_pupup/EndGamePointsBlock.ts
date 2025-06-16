import {Sprite, Text} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {StaticData} from "../../../../../StaticData";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class EndGamePointsBlock extends Sprite {
    private pointsIcon: Sprite;
    private pointsValueText: Text;
    private ptText: Text;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.setPointsValue(StaticData.getCurrentGameConfig().targetScore);
    }

    destroy() {
        super.destroy();
    }

    private createChildren() {
        this.pointsIcon = DisplayObjectFactory.createSprite("table/end_game/points");
        this.pointsValueText = TextFactory.createCommissioner({
            fontSize: 40,
            fill: 0xFFD356,
        });
        this.ptText = TextFactory.createCommissioner({
            value: "Pt.",
            fontSize: 26,
            fill: 0xFFD356,
        });
    }

    private addChildren() {
        this.addChild(this.pointsIcon);
        this.addChild(this.pointsValueText);
        this.addChild(this.ptText);
    }

    private initChildren() {
        Pivot.center(this.pointsIcon);
        Pivot.center(this.ptText);
        this.ptText.y = 5;

        this.pointsValueText.style.stroke = 0x5B2F16;
        this.pointsValueText.style.strokeThickness = 4;

        this.ptText.style.stroke = 0x5B2F16;
        this.ptText.style.strokeThickness = 2;
    }

    private setPointsValue(value: number) {
        this.pointsValueText.text = value;
        Pivot.center(this.pointsValueText);
        this.pointsIcon.x = -(this.pointsValueText.width + this.pointsIcon.width) / 2 - 8;
        this.ptText.x = (this.pointsValueText.width + this.ptText.width) / 2;
    }
}