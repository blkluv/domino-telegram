import {Sine, TweenMax} from "gsap";
import {Sprite, Text} from "pixi.js";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {GameEvents} from "../../../../../GameEvents";
import {LanguageService} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import Tween = gsap.core.Tween;


export class Hand extends Sprite {

    private handTween: Tween;
    private handSprite: Sprite;
    private youWillStartText: Text;
    private onSpectatingBindThis: (e: MessageEvent) => void;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.onSpectatingBindThis = this.onSpectating.bind(this);
        addEventListener(GameEvents.SPECTATING, this.onSpectatingBindThis);
    }

    destroy() {
        removeEventListener(GameEvents.SPECTATING, this.onSpectatingBindThis);
        this.onSpectatingBindThis = undefined;

        this.handTween?.kill();
        this.handTween = undefined;

        this.removeChild(this.handSprite);
        this.handSprite.destroy();
        this.handSprite = undefined;

        super.destroy();
    }

    up(value: boolean = true) {
        this.handTween?.kill();
        let newValue: number = value ? 0 : -10;
        if (WindowFocusController.documentVisible) {
            this.handTween = TweenMax.to(this.pivot, {duration: .2, y: newValue, ease: Sine.easeInOut});
        } else {
            this.pivot.y = newValue;
        }
    }

    private onSpectating(e: MessageEvent): void {
        let spectating: boolean = e.data;
        this.youWillStartText.visible = spectating;
    }

    private createChildren() {
        this.handSprite = DisplayObjectFactory.createSprite("table/hand");
        this.youWillStartText = TextFactory.createCommissioner({value: LanguageService.getTextByKey("Spectator/HandText"), fontSize: 35, fontWeight: "700", fill: 0x174847});
    }

    private addChildren() {
        this.addChild(this.handSprite);
        this.addChild(this.youWillStartText).visible = false;
    }

    private initChildren() {
        Pivot.center(this.handSprite, undefined, false);
        Pivot.center(this.youWillStartText);

        this.youWillStartText.y = -15;
    }
}