import {Sprite} from "pixi.js";
import {DominoGame} from "../app";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class Resize {
    static scaleBackground(background: Sprite): void {
        if (DominoGame.instance.screenW / DominoGame.instance.screenH > background.texture.width / background.texture.height) {
            background.width = DominoGame.instance.screenW;
            background.scale.y = background.scale.x;

        } else {
            background.height = DominoGame.instance.screenH;
            background.scale.x = background.scale.y;
        }
        Pivot.center(background);
    }
}