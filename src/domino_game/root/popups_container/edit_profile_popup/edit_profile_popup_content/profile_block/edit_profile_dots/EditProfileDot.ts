import {DisplayObjectFactory, Pivot} from "@azur-games/pixi-vip-framework";
import {Linear, TweenMax} from "gsap";
import {Sprite} from "pixi.js";


export class EditProfileDot extends Sprite {
    background: Sprite;
    scaleTween: TweenMax;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.animate(Math.random() * 2, 2 + Math.random() * 2, .5 + Math.random() * .5);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("edit_profile/dot");
    }

    addChildren(): void {
        this.addChild(this.background);
    }

    initChildren(): void {
        Pivot.center(this.background);
        this.background.alpha = .5;
        this.background.scale.set(0);
    }

    animate(delay: number, duration: number, size: number): void {
        this.scaleTween?.kill();
        this.scaleTween = TweenMax.to(this.background.scale, duration, {
            x: size,
            y: size,
            ease: Linear.easeInOut,
            yoyo: true,
            repeat: -1,
            delay
        });
    }

    destroy(): void {
        this.scaleTween?.kill();
        this.scaleTween = null;

        this.removeChild(this.background);
        this.background.destroy();
        this.background = null;

        super.destroy();
    }
}
