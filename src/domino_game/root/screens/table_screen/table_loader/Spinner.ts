import {Linear, TweenMax} from "gsap";
import {Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class Spinner extends Sprite {
    private background: Sprite;
    private clockIcon: Sprite;
    private spinner: Sprite;
    private spinnerTween: TweenMax;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.spin();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("table/loader/bg");
        this.clockIcon = DisplayObjectFactory.createSprite("table/loader/clock");
        this.spinner = DisplayObjectFactory.createSprite("table/loader/spinner");
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.clockIcon);
        this.addChild(this.spinner);
    }

    initChildren(): void {
        Pivot.center(this.background);
        Pivot.center(this.clockIcon);
        Pivot.center(this.spinner);
    }

    spin(): void {
        this.spinnerTween?.kill();
        this.spinnerTween = TweenMax.to(this.spinner, 2, {
            rotation: Math.PI * 2,
            ease: Linear.easeNone,
            repeat: -1
        });
    }

    destroy(): void {
        this.spinnerTween?.kill();
        this.spinnerTween = null;

        this.removeChild(this.background);
        this.removeChild(this.clockIcon);
        this.removeChild(this.spinner);

        this.background.destroy();
        this.clockIcon.destroy();
        this.spinner.destroy();

        this.background = null;
        this.clockIcon = null;
        this.spinner = null;

        super.destroy();
    }
}
