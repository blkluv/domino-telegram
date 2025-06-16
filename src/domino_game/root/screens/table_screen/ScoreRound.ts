import {Sine, TweenMax} from "gsap";
import {Sprite} from "pixi.js";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class ScoreRound extends Sprite {
    private back: Sprite;
    private text: LanguageText;
    private dominoText: LanguageText;
    private jumpTween: TweenMax;

    constructor(private value: number = 0, private green: boolean = true) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.setBackground(green);
        this.setValue(value, green);
        this.visible = !!value;
    }

    setValue(value: number, green: boolean = true, domino: boolean = false): void {
        this.value = value;
        let color: number = green ? 0x2D6012 : 0x69231A;
        this.text.changeText((domino ? "+" : "") + value.toString());
        this.text.setTextStroke(color, 4);
        this.text.setTextShadow(color, 1, 0);

        if (domino) {
            this.text.x = -3;
            this.text.y = -7;
            this.back.texture = LoaderService.getTexture("table/points/domino_10_points");
            this.back.width = this.back.texture.width;
            this.text.style.fontSize = 55;
            Pivot.center(this.back);
            Pivot.center(this.text);
        } else {
            this.text.x = 1;
            this.text.y = -2;
        }

        this.dominoText.visible = domino;
    }

    destroy() {
        this.removeChild(this.back);
        this.removeChild(this.text);
        this.removeChild(this.dominoText);

        this.back.destroy();
        this.text.destroy();
        this.dominoText.destroy();

        this.back = undefined;
        this.text = undefined;
        this.dominoText = undefined;

        super.destroy();
    }

    jump() {
        if (!WindowFocusController.documentVisible) {
            return;
        }
        this.scale.set(1);
        this.jumpTween?.kill();
        this.jumpTween = TweenMax.to(this.scale, {
            duration: .1,
            x: 1.4,
            y: 1.4,
            ease: Sine.easeOut,
            yoyo: true,
            repeat: 1
        });
    }

    setBackground(green: boolean): void {
        this.back.texture = LoaderService.getTexture("table/points/" + (green ? "green" : "red"));
        Pivot.center(this.back);
    }

    private createChildren() {
        this.back = DisplayObjectFactory.createSprite("table/points/green");
        this.text = new LanguageText({key: this.value.toString(), fontSize: 50});
        this.dominoText = new LanguageText({key: "DOMINO", fontSize: 20, fill: [0xFFFFFF, 0xFFF939, 0xF49601]});
    }

    private addChildren() {
        this.addChild(this.back);
        this.addChild(this.text);
        this.addChild(this.dominoText).y = 33;
    }

    private initChildren() {
        this.dominoText.style.stroke = 0x754504;
        this.dominoText.style.strokeThickness = 2;
        this.dominoText.visible = false;
        Pivot.center(this.dominoText);
    }
}