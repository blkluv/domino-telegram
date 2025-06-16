import {Sine, TweenMax} from "gsap";
import {NineSlicePlane, Sprite, Text} from "pixi.js";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../../factories/TextFactory";
import {GameMode} from "../../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class PlayerScore extends Sprite {
    private back: NineSlicePlane;
    private valueText: Text;
    private ptText: Text;
    private jumpTween: TweenMax;
    private _value: number = 0;

    constructor(private initialScale: number = 1) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.setValue(0);
        this.visible = [GameMode.CLASSIC, GameMode.FIVES, GameMode.BLOCK].includes(DynamicData.socketGameRequest.mode);
        this.scale.set(this.initialScale);
    }

    destroy() {
        this.jumpTween?.kill();
        this.jumpTween = undefined;

        this.removeChild(this.back);
        this.removeChild(this.valueText);
        this.removeChild(this.ptText);

        this.back.destroy();
        this.valueText.destroy();
        this.ptText.destroy();

        this.back = undefined;
        this.valueText = undefined;
        this.ptText = undefined;

        super.destroy();
    }

    get value(): number {
        return this._value;
    }

    setValue(value: number, initial: boolean = false): void {
        if (value && this._value == value) {
            return;
        }
        this._value = value;
        this.valueText.text = value;
        Pivot.center(this.valueText);
        this.ptText.x = this.valueText.width / 2;
        this.valueText.x = -this.ptText.width / 2;
        initial || value && this.jump();
    }

    private addChildren() {
        this.addChild(this.back);
        this.addChild(this.valueText);
        this.addChild(this.ptText);
    }

    jump() {
        if (!WindowFocusController.documentVisible) {
            return;
        }
        let goScale: number = this.initialScale * 1.4;
        this.scale.set(this.initialScale);
        this.jumpTween?.kill();
        this.jumpTween = TweenMax.to(this.scale, {
            duration: .1,
            x: goScale,
            y: goScale,
            ease: Sine.easeOut,
            yoyo: true,
            repeat: 1
        });
    }

    private initChildren() {
        this.valueText.style.stroke = 0xffffff;
        this.valueText.style.strokeThickness = 4;
        this.valueText.style.dropShadow = true;
        this.valueText.style.dropShadowAngle = 90;
        this.valueText.style.padding = 4;

        this.back.width = 194;

        Pivot.center(this.back);
        Pivot.center(this.ptText);

        this.valueText.y = -1;
        this.ptText.y = 5;
    }

    private createChildren() {
        this.back = DisplayObjectFactory.createNineSlicePlane("table/end_game/points_bg", 35, 35, 35, 35);
        this.valueText = TextFactory.createCommissioner({fontSize: 52, fill: [0xFFDF51, 0xFF8F07], value: ""});
        this.ptText = TextFactory.createCommissioner({fontSize: 30, value: "Pt."});
    }
}