import {Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {DominoNumber} from "../domino_logic/DominoNumber";


export class BazarAbsentVals extends Sprite {
    private vals: Sprite[];

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    private createChildren(): void {
        this.vals = [0, 1, 2, 3, 4, 5, 6].map(value => DisplayObjectFactory.createSprite("table/bazar/vals/" + value));
    }

    private addChildren(): void {
        this.vals.forEach(val => this.addChild(val).scale.set(.8));
    }

    private initChildren(): void {
        this.vals.forEach(val => val.visible = false);
    }

    update(absentNumbers: DominoNumber[]): void {
        this.vals.forEach((val: Sprite, index: number) => {
            val.visible = absentNumbers.includes(index as DominoNumber);
        });
        this.vals.filter(val => val.visible).forEach((val: Sprite, index: number) => {
            val.x = -index * 70;
        });
    }

    destroy(): void {
        let val: Sprite;
        while (this.vals.length) {
            val = this.vals.shift();
            this.removeChild(val);
            val.destroy();
        }
        this.vals = undefined;
        super.destroy();
    }
}