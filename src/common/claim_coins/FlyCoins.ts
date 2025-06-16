import {DisplayObjectFactory, LoaderService, Pivot, Timeout} from "@azur-games/pixi-vip-framework";
import {Linear, Sine, TweenMax} from "gsap/gsap-core";
import {BLEND_MODES, IPoint, Point, SimpleRope, Sprite} from "pixi.js";
import {SoundsPlayer} from "../../services/SoundsPlayer";
import Tween = gsap.core.Tween;


export class FlyCoins extends Sprite {
    private container: Sprite;
    private count: number = 0;
    private tweens: Tween[] = [];

    constructor(private coinTextureName: string = "table/sit/money_icon", private coinScale: number = 1) {
        super();
        this.createChildren();
        this.addChildren();
    }

    createChildren(): void {
        this.container = new Sprite();
    }

    addChildren(): void {
        this.addChild(this.container);
    }

    async flyCoins(position1: Point, position2: Point): Promise<void> {
        let plotnost: number = .5;
        let first: boolean = true;
        await new Promise<void>(async resolve => {
            for (let i = 0; i < 10 * plotnost; i++) {
                this.flyCoin(position1, position2, first);
                first = false;
                await Timeout.milliseconds(30 / plotnost + Math.random() * 5);
                this.flyCoin(position1, position2);
                await Timeout.milliseconds(30 / plotnost + Math.random() * 5);
                this.flyCoin(position1, position2);
                await Timeout.milliseconds(30 / plotnost + Math.random() * 5);
            }
            resolve();
        });
    }

    async flyCoin(position1: Point, position2: Point, first: boolean = false, coins: number = 0): Promise<void> {
        let sqrt2: number = Math.sqrt(2) / 2;
        let coinAngle: number = 0;
        let coin: Sprite = DisplayObjectFactory.createSprite(this.coinTextureName);
        let coin1: Sprite = DisplayObjectFactory.createSprite(this.coinTextureName);
        let coin2: Sprite = DisplayObjectFactory.createSprite(this.coinTextureName);
        let coinContainer: Sprite = DisplayObjectFactory.createSprite();
        coin.scale.set(this.coinScale);
        coin1.scale.set(this.coinScale);
        coin2.scale.set(this.coinScale);
        Pivot.center(coin);
        Pivot.center(coin1);
        Pivot.center(coin2);

        coinContainer.position.set(position1.x, position1.y);
        let prevPosition: IPoint = new Point();
        prevPosition.set(coinContainer.x, coinContainer.y);
        coin1.position.set(coinContainer.x, coinContainer.y);
        coin2.position.set(position2.x, position2.y);
        let totalPathLength: number = Math.sqrt(Math.pow(coin2.x - coin1.x, 2) + Math.pow(coin2.y - coin1.y, 2));
        coinContainer.addChild(coin);

        let tween1: TweenMax;
        let sinStrength: {value: number} = {value: 0};
        let duration: number = totalPathLength / 1300;
        let _self = this;
        _self.count += 2;
        // @ts-ignore
        coin.count = _self.count;

        let points: Point[] = [];

        for (let j = 0; j < 10; j++) {
            points.push(new Point(coinContainer.x, coinContainer.y));
        }
        let rope: SimpleRope = new SimpleRope(LoaderService.getTexture("table/trail"), points);
        rope.blendMode = BLEND_MODES.ADD;
        rope.alpha = .5;
        let point: Point;
        this.container.addChild(rope);
        this.container.addChild(coinContainer);
        this.container.addChild(coin2).visible = false;
        let date = Date.now();
        await Promise.all([
            new Promise<void>(async resolve => {
                await new Promise(resolve =>
                    this.tweens.push(tween1 = TweenMax.to(coinContainer, {
                        duration,
                        x: position2.x,
                        onComplete: resolve,
                        ease: Sine.easeInOut,
                        onUpdate
                    })));
                this.tweens.splice(this.tweens.indexOf(tween1), 1);
                resolve();
            }),
            new Promise<void>(async resolve => {
                let tween: Tween;
                await new Promise(resolve =>
                    this.tweens.push(tween = TweenMax.to(coinContainer, {
                        duration,
                        y: position2.y,
                        onComplete: resolve,
                        ease: Linear.easeNone,
                    })));
                this.tweens.splice(this.tweens.indexOf(tween), 1);
                resolve();
            }),
            new Promise<void>(async resolve => {
                let tween: Tween;
                await new Promise(resolve => this.tweens.push(tween = TweenMax.to(sinStrength, {
                    duration: duration * .5,
                    value: 1.1,
                    onComplete: resolve,
                    ease: Sine.easeInOut,
                    yoyo: true,
                    repeat: 1
                })));
                this.tweens.splice(this.tweens.indexOf(tween), 1);
                resolve();
            }),
        ]);
        SoundsPlayer.play("coinReachBalance");
        coinContainer.visible = false;
        coin2.visible = true;

        let coinShine: Sprite = DisplayObjectFactory.createSprite("table/sit/coin_shine");
        coinShine.blendMode = BLEND_MODES.ADD;
        coin2.addChild(coinShine).alpha = 0;
        coinShine.x = coin2.pivot.x;
        coinShine.y = coin2.pivot.y;
        coinShine.rotation = Math.random() * 10;
        await Promise.all([
            new Promise<void>(async resolve => {
                await new Promise(resolve =>
                    this.tweens.push(tween1 = TweenMax.to(coinContainer, {
                        duration,
                        x: position2.x,
                        onComplete: resolve,
                        ease: Linear.easeNone,
                        onUpdate
                    })));
                this.tweens.splice(this.tweens.indexOf(tween1), 1);
                resolve();
            }),
            new Promise<void>(async resolve => {
                let tween: Tween;
                await new Promise(resolve =>
                    this.tweens.push(tween = TweenMax.to(coin2.scale, {
                        duration: duration / 10,
                        x: 1.4,
                        y: 1.4,
                        yoyo: true,
                        repeat: 1,
                        onComplete: resolve,
                        ease: Sine.easeOut,
                    })));
                this.tweens.splice(this.tweens.indexOf(tween), 1);
                resolve();
            }),
            new Promise<void>(async resolve => {
                let tween: Tween;
                await new Promise(resolve =>
                    this.tweens.push(tween = TweenMax.to(coinShine, {
                        duration: duration / 10,
                        alpha: Math.random(),
                        yoyo: true,
                        repeat: 1,
                        onComplete: resolve,
                        ease: Sine.easeOut,
                    })));
                this.tweens.splice(this.tweens.indexOf(tween), 1);
                resolve();
            })
        ]);
        coin2.removeChild(coinShine);
        coinContainer.removeChild(coin);
        this.container.removeChild(coin1);
        this.container.removeChild(coin2);
        this.container.removeChild(coinContainer);
        this.container.removeChild(rope);
        coinShine.destroy();
        rope.destroy();
        coinContainer.destroy();
        coin.destroy();
        coin1.destroy();
        coin2.destroy();

        async function onUpdate(): Promise<void> {
            coinAngle += 5;
            coinContainer.rotation = Math.atan2(prevPosition.y - coinContainer.y, prevPosition.x - coinContainer.x);
            coin.rotation = -coinContainer.rotation;
            // @ts-ignore
            let corner: number = (tween1.progress() * totalPathLength / 100 + coin.count * 12);
            coin.y = Math.sin(corner) * sinStrength.value * totalPathLength / 30;
            // @ts-ignore
            coin.scale.set(.2 + (sinStrength.value + Math.cos(corner) * .3 * sinStrength.value));
            prevPosition.set(coinContainer.x, coinContainer.y);
            let p: Point = points[0];
            p.set(coinContainer.x - Math.sin(coinContainer.rotation) * coin.y, coinContainer.y + Math.cos(coinContainer.rotation) * coin.y);
            if (Date.now() - date > 33) {
                date = Date.now();
                point = points.pop();
                point.set(coinContainer.x - Math.sin(coinContainer.rotation) * coin.y, coinContainer.y + Math.cos(coinContainer.rotation) * coin.y);
                points.unshift(point);
                if (Math.random() < .1 && coinContainer.visible) {
                    let star: Sprite = DisplayObjectFactory.createSprite(Math.random() > .5 ? "table/end_game/star" : "table/end_game/winner_star");
                    star.x = point.x;
                    star.y = point.y;
                    star.scale.set(Math.random() / 2 + .5);
                    Pivot.center(star);
                    _self.addChildAt(star, 0);
                    await new Promise(resolve => TweenMax.to(star, {duration: 1.4, alpha: 0, x: star.x + 10 + Math.random() * 40, onComplete: resolve}));
                    _self.removeChild(star);
                    star.destroy();
                }
            }
        }
    }

    destroy(): void {
        let tween: TweenMax;
        while (this.tweens.length) {
            tween = this.tweens.shift();
            tween.kill();
        }

        this.tweens = undefined;
        this.removeChild(this.container);
        this.container.destroy();
        this.container = null;

        super.destroy();
    }
}
