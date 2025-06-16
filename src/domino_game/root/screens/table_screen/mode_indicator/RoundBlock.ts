import {Sprite, Text} from "pixi.js";
import {GameStateData, GameStateEvents} from "../../../../../data/active_data/GameStateData";
import {ActiveData} from "../../../../../data/ActiveData";
import {TextFactory} from "../../../../../factories/TextFactory";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class RoundBlock extends Sprite {
    private roundValueText: Text;
    private roundText: Text;
    private gameStateData: GameStateData;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.setRoundValue(1);
    }

    private createChildren() {
        this.roundValueText = TextFactory.createCommissioner({
            value: "",
            fontSize: 44,
        });
        this.roundText = TextFactory.createCommissioner({
            value: "ROUND",
            fontSize: 20,
            fill: 0x6423a5,
        });
    }

    private addChildren() {
        this.addChild(this.roundValueText);
        this.addChild(this.roundText);
    }

    private initChildren() {
        Pivot.center(this.roundText);

        this.roundValueText.y = -14;
        this.roundText.y = 20;

        this.roundValueText.style.stroke = 0x623895;
        this.roundValueText.style.strokeThickness = 4;

        this.roundText.style.stroke = 0xc58bfb;
        this.roundText.style.strokeThickness = 3;
    }

    destroy() {
        this.gameStateData?.removeListener(GameStateEvents.ROUND_CHANGED, this.onRoundChanged, this);
        this.gameStateData = undefined;

        this.removeChild(this.roundValueText);
        this.removeChild(this.roundText);

        this.roundValueText.destroy();
        this.roundText.destroy();

        this.roundValueText = undefined;
        this.roundText = undefined;

        super.destroy();
    }

    setGameStateData(gameStateData: GameStateData) {
        this.gameStateData?.removeListener(GameStateEvents.ROUND_CHANGED, this.onRoundChanged, this);
        this.gameStateData = gameStateData;
        this.gameStateData.addListener(GameStateEvents.ROUND_CHANGED, this.onRoundChanged, this);
        this.onRoundChanged();
    }

    private onRoundChanged(): void {
        this.setRoundValue(ActiveData.gameStateData.round);
    }

    setRoundValue(value: number) {
        this.roundValueText.text = value;
        Pivot.center(this.roundValueText);
    }

    reset() {
        this.setRoundValue(1);
    }
}