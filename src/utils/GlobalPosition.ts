import {Point} from "pixi.js";
import {DominoGame} from "../app";


export class GlobalPosition {
    static getGlobalPosition(globalPoint: Point): Point {
        globalPoint.x -= DominoGame.instance.root.x;
        globalPoint.y -= DominoGame.instance.root.y;
        globalPoint.x /= DominoGame.instance.scale;
        globalPoint.y /= DominoGame.instance.scale;
        return globalPoint;
    }
}