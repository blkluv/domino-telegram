import {Sine, TweenMax} from "gsap/gsap-core";
import {Sprite, Text} from "pixi.js";
import {TextFactory} from "../../../../../../factories/TextFactory";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class Letters extends Sprite {
    private letters: Text[];
    private animateTweens: TweenMax[] = [];

    constructor(private text: string, private textStrokeColor: number, private extShadowColor: number) {
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

        super.destroy();
    }

    async show() {
        let notSpaceLetters: Text[] = this.letters.filter(letter => letter.text);
        let oneLetterDelay = .3 / notSpaceLetters.length;
        await Promise.all(notSpaceLetters.map((letter: Text, index: number) => new Promise(resolve => this.animateTweens.push(TweenMax.to(letter, {
                duration: .08,
                y: -66,
                ease: Sine.easeOut,
                yoyo: true,
                repeat: 1,
                onComplete: resolve,
                onStart: () => {
                    letter.visible = true;
                },
                delay: index * oneLetterDelay
            }
        )))));
    }

    private killAnimations() {
        let animation: TweenMax;
        while (this.animateTweens.length) {
            animation = this.animateTweens.shift();
            animation.kill();
        }
    }

    private createChildren() {
        this.letters = this.text.split("").map(char => TextFactory.createCommissioner({fontSize: 95, value: char}));
    }

    private addChildren() {
        this.letters.forEach(letter => this.addChild(letter));
    }

    private initChildren() {
        let width: number = this.letters.reduce((prev: number, currentValue: Text) => prev + currentValue.width, 0);
        let startX: number = -width / 2;
        this.letters.forEach(letter => {
            Pivot.center(letter);
            startX += letter.width / 2;
            letter.x = startX;
            startX += letter.width / 2;
            letter.style.stroke = this.textStrokeColor;
            letter.style.strokeThickness = 4;
            letter.style.dropShadow = true;
            letter.style.dropShadowBlur = 0;
            letter.style.dropShadowDistance = 8;
            letter.style.dropShadowAngle = Math.PI / 2;
            letter.visible = false;
        });
    }
}