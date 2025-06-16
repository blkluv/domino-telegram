import {Sine, TweenMax} from "gsap";
import {BLEND_MODES, NineSlicePlane, Sprite} from "pixi.js";
import {DominoGame} from "../../../../app";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class LobbyLights extends Sprite {
    private lights: NineSlicePlane[] = [];
    private tweens: TweenMax[] = [];
    private tweens2: TweenMax[] = [];
    lightOn: boolean;

    constructor() {
        super();

        this.interactive = this.interactiveChildren = false;
    }

    destroy() {
        super.destroy();

        let tween: TweenMax;
        while (this.tweens.length) {
            tween = this.tweens.shift();
            tween.kill();
        }

        this.tweens = undefined;

        let tween2: TweenMax;
        while (this.tweens2.length) {
            tween2 = this.tweens2.shift();
            tween2.kill();
        }

        this.tweens2 = undefined;

        let light: NineSlicePlane;
        while (this.lights.length) {
            light = this.lights.shift();
            this.removeChild(light);
            light.destroy();
        }

        this.lights = undefined;
    }

    createL() {
        if (this.lightOn) {
            return;
        }
        this.lightOn = true;
        for (let index: number = 0; index < 5; index++) {
            this.createLight();
        }
    }

    private async createLight() {
        if (this._destroyed || !this.lightOn || this.lights.length > 7) {
            return;
        }
        let light: NineSlicePlane = DisplayObjectFactory.createNineSlicePlane("lobby/light", 80, 0, 80, 0);
        this.addChild(light).alpha = 0;
        light.interactive = light.interactiveChildren = false;
        light.x = Math.random() * 200 - 100;
        light.width += Math.random() * 200;
        light.height = DominoGame.instance.screenH;
        light.y = DominoGame.instance.screenH / 2;
        light.scale.y = -1;
        Pivot.center(light, true, false);
        this.lights.push(light);
        light.blendMode = BLEND_MODES.ADD;
        let tween: TweenMax;
        let tween2: TweenMax;
        await new Promise(resolve => {
            let duration: number = (1 + Math.random()) / 2;
            let delay: number = Math.random() / 4;
            this.tweens.push(tween = TweenMax.to(light, {alpha: Math.random() / 8, yoyo: true, repeat: 1, ease: Sine.easeOut, onComplete: resolve, delay, duration: duration}));
            this.tweens2.push(tween2 = TweenMax.to(light, {x: light.x + 100 * (Math.random() > .5 ? 1 : -1) * Math.random(), ease: Sine.easeInOut, delay, duration: duration * 2}));
        });
        this.lights.splice(this.lights.indexOf(light), 1);
        this.tweens.splice(this.tweens.indexOf(tween), 1);
        this.tweens2.splice(this.tweens2.indexOf(tween2), 1);
        this.createLight();
    }
}