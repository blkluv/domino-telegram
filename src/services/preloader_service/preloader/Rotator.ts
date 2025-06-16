import {Sine, TweenMax} from "gsap";
import {Sprite} from "pixi.js";
import {RotatorItem} from "./rotater/RotatorItem";


export class Rotator extends Sprite {
    private items: RotatorItem[] = [];
    private rotationTween: TweenMax;

    constructor() {
        super();

        let dominoValues: number[] = [];
        while (dominoValues.length < 4) {
            let dominoValue: number = Math.floor(Math.random() * 6);
            dominoValues.indexOf(dominoValue) === -1 && dominoValues.push(dominoValue);
        }
        dominoValues.forEach((value: number, index) => {
            let rotatorItem: RotatorItem = new RotatorItem(index, value);
            this.addChild(rotatorItem);
            this.items.push(rotatorItem);

        });
    }

    private _corner: number;

    get corner(): number {
        return this._corner;
    }

    set corner(value: number) {
        this._corner = value;
        this.items.forEach(item => item.corner = value);
    }

    private rotate(): void {
        this.corner = 0;
        this.rotationTween?.kill();
        this.rotationTween = TweenMax.to(this, 2, {
            corner: Math.PI * 2,
            ease: Sine.easeInOut,
            repeat: -1
        });
    }

    start(): void {
        this.rotate();
    }

    stop(): void {
        this.rotationTween?.kill();
    }

    destroy(): void {
        let item: RotatorItem;
        while (this.items.length) {
            item = this.items.shift();
            this.removeChild(item);
            item.destroy();
        }
        this.items = null;

        this.rotationTween?.kill();
        this.rotationTween = null;
        super.destroy({children: true});
    }
}
