import {TweenMax} from "gsap";
import {NineSlicePlane, Rectangle, Sprite} from "pixi.js";
import {ShineParticles} from "../../../../../common/ShineParticles";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {LanguageService} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Letters} from "./state_label/Letters";


export class StateLabel extends Sprite {
    private back: NineSlicePlane;
    private letters: Letters;
    private shineParticlesLeft: ShineParticles;
    private shineParticlesRight: ShineParticles;

    constructor(private color: LabelColor, private textKey: string) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    destroy() {
        this.color = undefined;
        this.textKey = undefined;

        this.removeChild(this.back);
        this.removeChild(this.letters);
        this.removeChild(this.shineParticlesLeft);
        this.removeChild(this.shineParticlesRight);

        this.back.destroy();
        this.letters.destroy();
        this.shineParticlesLeft.destroy();
        this.shineParticlesRight.destroy();

        this.back = undefined;
        this.letters = undefined;
        this.shineParticlesLeft = undefined;
        this.shineParticlesRight = undefined;

        super.destroy();
    }

    async hide() {
        await Promise.all([
            new Promise(resolve => TweenMax.to(this.back, {duration: .2, height: 34, alpha: 0, onComplete: resolve, onUpdate: () => Pivot.center(this.back)})),
            new Promise(resolve => TweenMax.to(this.letters, {duration: .2, alpha: 0, onComplete: resolve})),
            new Promise(resolve => TweenMax.to(this.shineParticlesLeft, {duration: .3, alpha: 0, onComplete: resolve})),
            new Promise(resolve => TweenMax.to(this.shineParticlesRight, {duration: .3, alpha: 0, onComplete: resolve})),
        ]);
    }

    async show() {
        await new Promise(resolve => TweenMax.to(this.back, {duration: .2, height: 146, alpha: 1, onComplete: resolve, onUpdate: () => Pivot.center(this.back)}));
        await this.letters.show();
    }

    private createChildren() {
        let backgroundTextureName: string;
        let shineDotTextureName: string;
        let textStrokeColor: number;
        let textShadowColor: number;
        switch (this.color) {
            case LabelColor.BLUE:
                backgroundTextureName = "table/labels/gradient_blue";
                shineDotTextureName = "table/labels/dot_blue";
                textStrokeColor = 0x08709d;
                textShadowColor = 0x024f71;
                break;
            case LabelColor.ORANGE:
                backgroundTextureName = "table/labels/gradient_orange";
                shineDotTextureName = "table/labels/dot_orange";
                textStrokeColor = 0xca8501;
                textShadowColor = 0x715202;
                break;
            case LabelColor.RED:
                backgroundTextureName = "table/labels/gradient_red";
                shineDotTextureName = "table/labels/dot_red";
                textStrokeColor = 0xba4242;
                textShadowColor = 0x924040;
                break;
            case LabelColor.DARK:
                backgroundTextureName = "table/labels/gradient_dark";
                shineDotTextureName = "table/labels/dot_dark";
                textStrokeColor = 0x4855cd;
                textShadowColor = 0x253097;
                break;
        }
        this.back = DisplayObjectFactory.createNineSlicePlane(backgroundTextureName, 551, 17, 551, 17);
        this.letters = new Letters(LanguageService.getTextByKey(this.textKey), textStrokeColor, textShadowColor);
        let shineBox = new Rectangle(-146 / 2, -500, 146, 500);
        this.shineParticlesLeft = new ShineParticles(shineDotTextureName, 15, shineBox, .2);
        this.shineParticlesRight = new ShineParticles(shineDotTextureName, 15, shineBox, .2);
    }

    private addChildren() {
        this.addChild(this.back);
        this.addChild(this.shineParticlesLeft);
        this.addChild(this.shineParticlesRight);
        this.addChild(this.letters);
    }

    private initChildren() {
        this.letters.y = -10;
        Pivot.center(this.back);
        this.back.alpha = 0;

        this.shineParticlesLeft.rotation = -Math.PI / 2;
        this.shineParticlesRight.rotation = Math.PI / 2;

        this.shineParticlesLeft.x = -10;
        this.shineParticlesRight.x = -this.shineParticlesLeft.x;
    }
}

export enum LabelColor {
    RED,
    BLUE,
    ORANGE,
    DARK
}