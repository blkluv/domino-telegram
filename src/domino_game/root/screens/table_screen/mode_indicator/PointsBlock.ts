import {Sprite, Text} from "pixi.js";
import {DynamicData} from "../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {StaticData} from "../../../../../StaticData";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class PointsBlock extends Sprite {
    private pointsIcon: Sprite;
    private pointsValueText: Text;
    private ptText: Text;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        let targetScore = StaticData.gamesConfig.find(gameConfig => gameConfig.gameMode == DynamicData.socketGameRequest.mode && gameConfig.gameType == DynamicData.socketGameRequest.type).targetScore;
        this.setPointsValue(targetScore);
    }

    private createChildren() {
        this.pointsIcon = DisplayObjectFactory.createSprite("table/mode_indicator/icon_points");
        this.pointsValueText = TextFactory.createCommissioner({
            value: "",
            fontSize: 44,
        });
        this.ptText = TextFactory.createCommissioner({
            value: "Pt.",
            fontSize: 26,
            fill: 0x7746a9,
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
        this.ptText.y = 2;
        this.pointsValueText.y = -3;
        this.pointsValueText.style.stroke = 0x623895;
        this.pointsValueText.style.strokeThickness = 4;

        this.ptText.style.stroke = 0xc58bfb;
        this.ptText.style.strokeThickness = 3;
    }

    destroy() {
        super.destroy();
    }

    private setPointsValue(value: number) {
        this.pointsValueText.text = value;
        Pivot.center(this.pointsValueText);
        this.pointsIcon.x = -(this.pointsValueText.width + this.pointsIcon.width) / 2 - 5;
        this.ptText.x = (this.pointsValueText.width + this.ptText.width) / 2;
    }
}