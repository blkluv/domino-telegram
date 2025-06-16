import {Point} from "pixi.js";
import {Vector} from "./Vector";


export class DominoVector {
    constructor(public start: Vector, public end: Vector) {
    }

    destroy() {
        delete this.start;
        delete this.end;
    }

    get centerPoint(): Vector {
        return new Vector(this.start.x + (this.end.x - this.start.x) * .5, this.start.y + (this.end.y - this.start.y) * .5);
    }
}