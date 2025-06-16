import {Sprite} from "pixi.js";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class RotatorItem extends Sprite {
    private icon: Sprite;

    constructor(private index: number, private dominoValue: number) {
        super();
        this.icon = new Sprite(LoaderService.getTexture("common/preloader/" + this.dominoValue));
        Pivot.center(this.icon);
        this.addChild(this.icon);
        this.icon.x = 30;
        this.icon.y = 30;
    }

    set corner(value: number) {
        this.rotation = value + Math.PI / 2 * this.index;
        this.icon.rotation = -this.rotation - value;
    }

    destroy(): void {
        this.removeChild(this.icon);
        this.icon.destroy();
        this.icon = null;
        super.destroy();
    }
}
