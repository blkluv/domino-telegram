import {Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class EndGameLineLight extends Sprite {
    private light: Sprite;
    private line: Sprite;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    destroy() {
        this.removeChild(this.light);
        this.removeChild(this.line);
        this.light.destroy();
        this.line.destroy();
        this.light = undefined;
        this.line = undefined;

        super.destroy();
    }

    private createChildren() {
        this.light = DisplayObjectFactory.createSprite("table/end_game/light");
        this.line = DisplayObjectFactory.createSprite("table/end_game/line");
    }

    private addChildren() {
        this.addChild(this.light);
        this.addChild(this.line);
    }

    private initChildren() {
        Pivot.center(this.light, true, false);
        Pivot.center(this.line);

        this.light.scale.set(4);
    }
}