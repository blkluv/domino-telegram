import gsap from "gsap";
import {Linear, TweenMax} from "gsap/gsap-core";
import {Rectangle, Sprite} from "pixi.js";
import {AppearanceContainer} from "@azur-games/pixi-vip-framework";
import {ShineParticles} from "../../../../../../common/ShineParticles";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {LanguageService} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {WinnerLabel} from "./winner_glow/WinnerLabel";


export class WinnerGlow extends AppearanceContainer {
    private back1: Sprite;
    private back2: Sprite;
    private back1Tween: TweenMax;
    private back2Tween: TweenMax;
    private shineParticles: ShineParticles;
    private label: WinnerLabel;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.appearChildren();
    }

    destroy() {
        this.back1Tween.kill();
        this.back2Tween.kill();

        this.removeChild(this.back1);
        this.removeChild(this.back2);
        this.removeChild(this.shineParticles);
        this.removeChild(this.label);

        this.back1.destroy();
        this.back2.destroy();
        this.shineParticles.destroy();
        this.label.destroy();

        this.back1 = undefined;
        this.back2 = undefined;
        this.shineParticles = undefined;
        this.label = undefined;

        super.destroy();
    }

    private createChildren() {
        this.back1 = DisplayObjectFactory.createSprite("table/end_game/winner_glow");
        this.back2 = DisplayObjectFactory.createSprite("table/end_game/winner_glow");
        this.shineParticles = new ShineParticles("table/end_game/star", 10, new Rectangle(-150, -150, 300, 300), .6);
        //this.back1.blendMode = this.back2.blendMode = BLEND_MODES.SCREEN;
        this.label = new WinnerLabel(LanguageService.getTextByKey("PlayerAvatarStatus/winner"));
    }

    private addChildren() {
        this.addChild(this.back1);
        this.addChild(this.back2);
        this.addChild(this.shineParticles);
        this.addChild(this.label);
    }

    private initChildren() {
        Pivot.center(this.back1);
        Pivot.center(this.back2);
        Pivot.center(this.shineParticles);
        this.label.y = 170;
        this.label.animateLoop();
    }

    private appearChildren() {
        this.back1Tween = gsap.to(this.back1, 25, {rotation: Math.PI * 2, repeat: -1, ease: Linear.easeNone});
        this.back2Tween = gsap.to(this.back2, 25, {rotation: -Math.PI * 2, repeat: -1, ease: Linear.easeNone});
    }
}