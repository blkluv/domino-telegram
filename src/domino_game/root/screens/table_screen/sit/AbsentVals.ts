import {Sprite} from "pixi.js";
import {ArrayWrapEvent} from "../../../../../data/active_data/base/static_config_data/array_wrap/ArrayWrapEvent";
import {RoundUserData} from "../../../../../data/active_data/game_state/players_data/RoundUserData";
import {DynamicData} from "../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {DominoNumber} from "../domino_logic/DominoNumber";


export class AbsentVals extends Sprite {
    private vals: Sprite[];
    private roundUserData: RoundUserData;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    update(absentNumbers: DominoNumber[]) {
        this.vals.forEach((val: Sprite, index: number) => {
            val.visible = absentNumbers.includes(index as DominoNumber) && DynamicData.kingMode;
        });

        this.vals.filter(val => val.visible).forEach((val: Sprite, index: number) => {
            Pivot.center(val);
            val.x = (index - ((absentNumbers.length - 1) / 2)) * 44;
        });
    }

    destroy() {
        let val: Sprite;
        while (this.vals.length) {
            val = this.vals.shift();
            this.removeChild(val);
            val.destroy();
        }
        this.vals = undefined;
        super.destroy();
    }

    private createChildren() {
        this.vals = [0, 1, 2, 3, 4, 5, 6].map(value => DisplayObjectFactory.createSprite("table/sit/vals/" + value));
    }

    setUserData(roundUserData: RoundUserData) {
        this.roundUserData = roundUserData;
        this.roundUserData.absentVals.addListener(ArrayWrapEvent.ELEMENT_REMOVED, this.onAbsentValsChanged, this);
        this.roundUserData.absentVals.addListener(ArrayWrapEvent.ELEMENT_ADDED, this.onAbsentValsChanged, this);
        this.onAbsentValsChanged();
    }

    private initChildren() {
        this.vals.forEach(val => val.visible = false);
    }

    clearRoundUserData() {
        this.roundUserData?.absentVals.removeListener(ArrayWrapEvent.ELEMENT_REMOVED, this.onAbsentValsChanged, this);
        this.roundUserData?.absentVals.removeListener(ArrayWrapEvent.ELEMENT_ADDED, this.onAbsentValsChanged, this);
        this.roundUserData = undefined;
    }

    private addChildren() {
        this.vals.forEach(val => this.addChild(val).alpha = .4);
    }

    private onAbsentValsChanged() {
        this.update(this.roundUserData.absentVals.interfaces);
        this.update(this.roundUserData.absentVals.interfaces);
    }
}