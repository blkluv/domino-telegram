import {Back, Linear, TweenMax} from "gsap";
import {Graphics, NineSlicePlane, Sprite, Text} from "pixi.js";
import {SitPlace} from "../../../../../dynamic_data/SitPlace";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {SoundsPlayer} from "../../../../../services/SoundsPlayer";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class TimerRound extends Sprite {
    private progressTween: TweenMax;
    private timerCircle: NineSlicePlane;
    private timerMask: Graphics;
    private timerText: Text;
    private textAlphaTween: TweenMax;
    private textAlphaTween2: TweenMax;
    private _value: number;

    constructor(private wid: number, private hei: number) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    private _progress: number = 0;

    get progress() {
        return this._progress;
    }

    set progress(value: number) {
        this._progress = value;

        this.timerMask.clear();
        this.timerMask.beginFill(0xff0000);
        this.timerMask.lineStyle(1, 0);
        this.timerMask.moveTo(0, 0);
        this.timerMask.arc(0, 0, 100, -Math.PI / 2 + Math.PI * 2 * value, -Math.PI / 2);
        this.timerMask.lineTo(0, 0);
        this.timerMask.endFill();
    }

    private createChildren() {
        this.timerCircle = DisplayObjectFactory.createNineSlicePlane("table/sit/timer_round", 55, 55, 55, 55);
        this.timerMask = new Graphics();
        this.timerText = TextFactory.createCommissioner({
            value: "",
            fontSize: 80,
            fill: 0xfbd148,
        });
    }

    private addChildren() {
        this.addChild(this.timerCircle);
        this.addChild(this.timerText);
        this.addChild(this.timerMask);
    }

    private initChildren() {
        this.timerCircle.width = this.wid;
        this.timerCircle.height = this.hei;
        Pivot.center(this.timerCircle);
        this.timerCircle.mask = this.timerMask;

        this.timerText.y = -6;
        this.timerText.style.stroke = 0x854C1F;
        this.timerText.style.strokeThickness = 6;
        this.timerText.style.fill = [0xFFF7AC, 0xF8DE6D, 0xFFCD38];
    }

    destroy() {
        this.killTimer();
        this.timerCircle.mask = null;
        this.removeChild(this.timerCircle);
        this.removeChild(this.timerMask);

        this.timerCircle.destroy();
        this.timerMask.destroy();

        this.timerCircle = null;
        this.timerMask = null;

        super.destroy();
    }

    setTimer(timerDuration: number, timerEndDelay: number, sitPlace: SitPlace) {
        this.killTimer();
        this.visible = true;
        if (timerEndDelay > 0) {
            this.visible = true;
            this.progress = (timerDuration - timerEndDelay) / timerDuration;
            this.setTextValue(Math.ceil((timerDuration - timerDuration * this.progress) / 1000), true);
            this.progressTween = TweenMax.to(this, (timerEndDelay) / 1000, {
                progress: 1, ease: Linear.easeNone, onUpdate: (value: number) => {
                    if (this.progress > .6 && !SoundsPlayer.playing("countdown") && sitPlace == SitPlace.BOTTOM) {
                        //SoundsPlayer.play("countdown");
                    }
                    this.setTextValue(Math.ceil((timerDuration - timerDuration * this.progress) / 1000), false);
                }
            });
        } else {
            this.visible = false;
        }
    }

    async setTextValue(value: number, fast: boolean) {
        if (value == this._value) {
            return;
        }
        this._value = value;
        this.textAlphaTween?.kill();
        this.textAlphaTween2?.kill();
        this.timerText.alpha = 1;
        if (fast) {
            this.timerText.text = value.toString();
            this.timerText.scale.set(1);
            Pivot.center(this.timerText);
            return;
        }
        Pivot.center(this.timerText);
        await Promise.all([
            new Promise(resolve => {
                this.textAlphaTween = TweenMax.to(this.timerText, {duration: .1, alpha: 0, y: -10, onComplete: resolve});
            }),
            new Promise(resolve => {
                this.textAlphaTween2 = TweenMax.to(this.timerText.scale, {duration: .1, x: .7, y: .7, onComplete: resolve});
            })
        ]);
        this.timerText.text = value.toString();
        this.timerText.y = 10;
        this.timerText.scale.set(1);
        Pivot.center(this.timerText);
        await new Promise(resolve => {
            this.textAlphaTween = TweenMax.to(this.timerText, {duration: .2, alpha: 1, y: -6, onComplete: resolve, ease: Back.easeOut});
        });
    }

    killTimer(): void {
        this.visible = false;
        this.progressTween?.kill();
        this.textAlphaTween?.kill();
        this.textAlphaTween2?.kill();
        this.progressTween = null;
    }
}