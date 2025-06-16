import {Sine} from "gsap";
import {TweenMax} from "gsap/gsap-core";
import {NineSlicePlane, Sprite, Text} from "pixi.js";
import {DynamicData} from "../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {GameMode} from "../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {NumberUtils} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class SitMoney extends Sprite {
    private back: NineSlicePlane;
    icon: Sprite;
    private moneyText: Text;
    private _value: number;
    private jumpTween: TweenMax;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.setValue(0);
    }

    destroy() {
        this.removeChild(this.back);
        this.removeChild(this.icon);
        this.removeChild(this.moneyText);

        this.back.destroy();
        this.icon.destroy();
        this.moneyText.destroy();

        this.back = undefined;
        this.icon = undefined;
        this.moneyText = undefined;

        super.destroy();
    }

    get value(): number {
        return this._value;
    }

    setValue(value: number) {
        this._value = value;
        this.visible = this._value > 0 && DynamicData.socketGameRequest?.mode == GameMode.PRO;
        this.moneyText.text = NumberUtils.coinsKiloFormat(Math.round(this._value));
        Pivot.center(this.moneyText);
    }

    async addValue(value: number): Promise<void> {
        let text: Text = TextFactory.createCommissioner({fontSize: 28, value: (value > 0 ? "+" : "") + value});
        let coin: Sprite = DisplayObjectFactory.createSprite("table/sit/money_icon");
        let container: Sprite = new Sprite();
        text.style.stroke = 0xffffff;
        text.style.strokeThickness = 4;
        text.style.fill = value > 0 ? [0x009558, 0x00c989] : [0xaaaaaa, 0x888888];
        Pivot.center(text);
        Pivot.center(coin);
        coin.scale.set(.8);
        coin.x = text.width / 2 + 1;
        text.x = -coin.width / 2 - 1;
        this.addChild(container);
        container.addChild(text).y = -1;
        container.addChild(coin);
        container.y = this.moneyText.y + (value > 0 ? -20 : 20);
        container.x = this.moneyText.x;
        await Promise.all([
            new Promise(resolve => TweenMax.to(container, {duration: .3, alpha: 0, ease: Sine.easeIn, onComplete: resolve, delay: 1.2})),
            new Promise(resolve => TweenMax.to(container, {duration: 1.5, y: value > 0 ? -50 : 50, ease: Sine.easeOut, onComplete: resolve})),
        ]);
        this.removeChild(container);
        container.removeChild(text);
        container.removeChild(coin);
        text.destroy();
        coin.destroy();
        container.destroy();
    }

    jump() {
        this.moneyText.scale.set(1);
        this.jumpTween?.kill();
        this.jumpTween = TweenMax.to(this.moneyText.scale, {duration: .1, x: 1.3, y: 1.3, ease: Sine.easeOut, yoyo: true, repeat: 1});
    }

    private createChildren() {
        this.back = DisplayObjectFactory.createNineSlicePlane("table/sit/money_bg", 23, 23, 23, 23);
        this.icon = DisplayObjectFactory.createSprite("table/sit/money_icon");
        this.moneyText = TextFactory.createCommissioner({fontSize: 28, value: ""});
    }

    private addChildren() {
        this.addChild(this.back);
        this.addChild(this.icon);
        this.addChild(this.moneyText);
    }

    private initChildren() {
        this.back.width = 150;
        Pivot.center(this.back);
        Pivot.center(this.icon);
        this.moneyText.style.stroke = 0x333333;
        this.moneyText.style.strokeThickness = 4;
        this.icon.x = -this.back.width / 2 + 10;
        this.moneyText.y = -3;
        this.moneyText.x = 5;
    }
}