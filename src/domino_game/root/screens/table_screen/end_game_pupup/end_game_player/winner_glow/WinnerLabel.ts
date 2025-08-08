import gsap from "gsap";
import {Sine, TweenMax} from "gsap/gsap-core";
import {Rectangle, Sprite, Text} from "pixi.js";
import {AppearanceContainer, ShineParticles, DisplayObjectFactory, Pivot, Timeout} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../../../factories/TextFactory";


export class WinnerLabel extends AppearanceContainer {
    private label: Sprite;
    private letters: Text[];
    private animateTweens: TweenMax[] = [];
    private shineParticles: ShineParticles;
    private stopped: boolean = false;

    constructor(private text: string) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    destroy() {

        this.killAnimations();

        let letter: Text;
        while (this.letters.length) {
            letter = this.letters.shift();
            this.removeChild(letter);
            letter.destroy();
        }

        this.removeChild(this.shineParticles);
        this.removeChild(this.label);
        this.shineParticles.destroy();
        this.label.destroy();
        this.shineParticles = null;
        this.label = null;

        super.destroy();
    }

    private createChildren() {
        this.label = DisplayObjectFactory.createSprite("table/end_game/winner_label");
        this.letters = this.text.split("").map(char => TextFactory.createCommissioner({fontSize: 48, value: char}));
        this.shineParticles = new ShineParticles("table/end_game/winner_star", 5, new Rectangle(-120, -40, 240, 80), .4);
    }

    private addChildren() {
        this.addChild(this.label).alpha = .7;
        this.addChild(this.shineParticles);
        this.letters.forEach(letter => this.addChild(letter));
    }

    private initChildren() {
        Pivot.center(this.label);

        let width: number = this.letters.reduce((prev: number, currentValue: Text) => prev + currentValue.width, 0);
        let startX: number = -width / 2;
        this.letters.forEach(letter => {
            Pivot.center(letter);
            startX += letter.width / 2;
            letter.x = startX;
            startX += letter.width / 2;
            letter.style.stroke = 0xffcc00;
            letter.y = -4;
            letter.style.strokeThickness = 4;
        });
    }

    async animateLoop() {
        this.stopped = false;
        this.killAnimations();
        this.animateTweens = [];
        await Promise.all(this.letters.map((letter: Text, index: number) => new Promise(resolve => this.animateTweens.push(gsap.to(letter.pivot, {
            duration: .15,
            y: 66,
            ease: Sine.easeOut,
            yoyo: true,
            repeat: 1,
            onComplete: resolve,
            delay: index / 20
        })))));
        this.killAnimations();
        if (this._destroyed || this.stopped) {
            return;
        }
        await Timeout.milliseconds(3000);
        if (this._destroyed || this.stopped) {
            return;
        }
        this.animateLoop();
    }

    private killAnimations() {
        let animation: TweenMax;
        while (this.animateTweens.length) {
            animation = this.animateTweens.shift();
            animation.kill();
        }
    }

    stop(): void {
        this.stopped = true;
    }
}