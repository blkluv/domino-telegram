import {DisplayObjectFactory, LanguageText, Pivot} from "@azur-games/pixi-vip-framework";
import {Sine, TweenMax} from "gsap";
import {NineSlicePlane, Sprite} from "pixi.js";


export class EditProfileError extends Sprite {
    private errorText: LanguageText;
    private errorTextBackground: NineSlicePlane;
    private alphaTween: TweenMax;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.alpha = 0;
    }

    createChildren(): void {
        this.errorText = new LanguageText({key: "ProfileSetNameWindow.too-short", fontSize: 34, fontWeight: "600", fill: 0xFFFFFF, autoFitWidth: 800});
        this.errorTextBackground = DisplayObjectFactory.createNineSlicePlane("edit_profile/error_gradient", 428, 1, 428, 1);
    }

    addChildren(): void {
        this.addChild(this.errorTextBackground);
        this.addChild(this.errorText);
    }

    initChildren(): void {
        this.errorTextBackground.width = 858;
        this.errorTextBackground.height = 76;

        this.errorText.setTextStroke(0x750D29, 4);

        Pivot.center(this.errorText);
        Pivot.center(this.errorTextBackground);

        this.errorTextBackground.y = 3;
    }

    changeText(key: string): void {
        this.errorText.changeText(key);
    }

    show(value: boolean): void {
        this.alphaTween?.kill();
        this.alphaTween = TweenMax.to(this, .2, {alpha: value ? 1 : 0, ease: Sine.easeInOut});
    }

    destroy(): void {
        this.alphaTween?.kill();
        this.alphaTween = null;

        this.removeChild(this.errorText);
        this.removeChild(this.errorTextBackground);

        this.errorText.destroy();
        this.errorTextBackground.destroy();

        this.errorText = null;
        this.errorTextBackground = null;

        super.destroy();
    }
}
