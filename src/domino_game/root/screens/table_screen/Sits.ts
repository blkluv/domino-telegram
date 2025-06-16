import {Back, Linear, Sine, TweenMax} from "gsap/gsap-core";
import {BLEND_MODES, IPoint, Point, SimpleRope, Sprite} from "pixi.js";
import {Camera} from "pixi3d";
import {DominoGame} from "../../../../app";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {StageResizeListening} from "@azur-games/pixi-vip-framework";
import {GameStateData} from "../../../../data/active_data/GameStateData";
import {ActiveData} from "../../../../data/ActiveData";
import {IPieceData} from "../../../../dynamic_data/IPieceData";
import {PiecePlace} from "../../../../dynamic_data/PiecePlace";
import {SitPlace} from "../../../../dynamic_data/SitPlace";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {SoundsPlayer} from "../../../../services/SoundsPlayer";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Timeout} from "@azur-games/pixi-vip-framework";
import {DominoItem} from "./domino_logic/DominoItem";
import {ScoreRound} from "./ScoreRound";
import {Sit} from "./Sit";
import Tween = gsap.core.Tween;


export class Sits extends StageResizeListening {
    private sits: Sit[] = [];
    private coinContainer: Sprite = new Sprite();
    private onFlyPointsBindThis: (e: MessageEvent) => void;
    private tweens: Tween[] = [];

    roundEndedWithDeadEnd: boolean = false;
    private topRound: ScoreRound;
    private topRound10: ScoreRound;
    private bottomRound: ScoreRound;
    private bottomRound10: ScoreRound;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onGameScaleChanged();

        this.onFlyPointsBindThis = this.onFlyPoints.bind(this);
        addEventListener(GameEvents.FLY_POINTS, this.onFlyPointsBindThis);
    }

    private count: number = 0;

    async onFlyPoints(e: MessageEvent) {
        let data: {side: SitPlace, score: number, callback: Function, lastPlayedDomino: DominoItem} = e.data;
        let score: ScoreRound = new ScoreRound(data.score, true);
        let sit: Sit = this.getSitBySitPlace(data.side);
        this.addChild(score);
        let point: Point = Camera.main.worldToScreen(data.lastPlayedDomino.worldTransform.position.x, data.lastPlayedDomino.worldTransform.position.y, data.lastPlayedDomino.worldTransform.position.z);
        score.x = point.x / DominoGame.instance.scale - DominoGame.instance.screenW / 2;
        score.y = point.y / DominoGame.instance.scale - DominoGame.instance.screenH / 2;
        score.scale.set(0);
        SoundsPlayer.playPointsSound(sit.getNextScoreIndex());
        await new Promise(resolve => {
            let tween = TweenMax.to(score.scale, {
                duration: .4,
                x: .9,
                y: .9,
                onComplete: resolve,
                ease: Back.easeOut,
            });
        });
        await Timeout.seconds(.5);
        await new Promise(resolve => {
            let tween = TweenMax.to(score, {
                duration: .4,
                x: sit.x + sit.playerScore.x,
                y: sit.y + sit.playerScore.y,
                onComplete: resolve,
                ease: Sine.easeInOut
            });
        });
        this.removeChild(score);
        sit.updateScore();
        data.callback();
    }

    set roundsVisible(value: boolean) {
        this.topRound.visible = value;
        this.topRound10.visible = value;
        this.bottomRound.visible = value;
        this.bottomRound10.visible = value;
    }

    setGameStateData(socketGameState: GameStateData): void {
        this.getSitBySitPlace(SitPlace.BOTTOM).setData(socketGameState, socketGameState.playersSlots.bottom);
        this.getSitBySitPlace(SitPlace.TOP).setData(socketGameState, socketGameState.playersSlots.top);
        this.getSitBySitPlace(SitPlace.LEFT).setData(socketGameState, socketGameState.playersSlots.left);
        this.getSitBySitPlace(SitPlace.RIGHT).setData(socketGameState, socketGameState.playersSlots.right);
    }

    async flyCoin(sit1: Sit, sit2: Sit, last: boolean = false, coinSum: number = 0, allCoinsSum: number = 0, totalSum: number = 0): Promise<void> {
        let coinAngle: number = 0;
        let coin: Sprite = DisplayObjectFactory.createSprite("table/sit/money_icon");
        //let coin3d: Model = DominoLogic.createCoin();
        //this.addChild(coin3d);
        //let coin3dMesh:Mesh3D = coin3d.children[0] as Mesh3D;
        let coin1: Sprite = DisplayObjectFactory.createSprite("table/sit/money_icon");
        let coin2: Sprite = DisplayObjectFactory.createSprite("table/sit/money_icon");
        let coinContainer: Sprite = DisplayObjectFactory.createSprite();
        Pivot.center(coin);
        Pivot.center(coin1);
        Pivot.center(coin2);
        coinContainer.position.set(
            sit1.position.x + sit1.money.position.x + sit1.money.icon.position.x,
            sit1.position.y + sit1.money.position.y + sit1.money.icon.position.y);
        //coin3d.x = coinContainer.x / 25.5;
        //coin3d.y = -coinContainer.y / 25.5 * sqrt2;
        let prevPosition: IPoint = new Point();
        prevPosition.set(coinContainer.x, coinContainer.y);
        coin1.position.set(coinContainer.x, coinContainer.y);
        coin2.position.set(sit2.position.x + sit2.money.position.x + sit2.money.icon.position.x, sit2.position.y + sit2.money.position.y + sit2.money.icon.position.y);
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
        this.coinContainer.addChild(rope);
        this.coinContainer.addChild(coinContainer);
        this.coinContainer.addChild(coin1);
        this.coinContainer.addChild(coin2).visible = false;
        let date = Date.now();
        await Promise.all([
            new Promise<void>(async resolve => {
                await new Promise(resolve =>
                    this.tweens.push(tween1 = TweenMax.to(coinContainer, {
                        duration,
                        x: sit2.position.x + sit2.money.position.x + sit2.money.icon.position.x,
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
                        y: sit2.position.y + sit2.money.position.y + sit2.money.icon.position.y,
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
        /*this.removeChild(coin3d);
        coin3d.destroy();
        coin3d = null;*/
        sit1.onCoinsChanged(sit1.money.value - coinSum);
        sit2.onCoinsChanged(sit2.money.value + coinSum);
        last && sit1.money.addValue(-allCoinsSum);
        last && sit2.money.addValue(allCoinsSum);
        sit2.money.jump();
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
                        x: sit2.position.x + sit2.money.position.x + sit2.money.icon.position.x,
                        onComplete: resolve,
                        ease: Linear.easeNone,
                        onUpdate
                    })));
                this.tweens.splice(this.tweens.indexOf(tween1), 1);
                resolve();
            }),
            new Promise<void>(async resolve => {
                let tween: Tween;
                await new Promise<void>(resolve =>
                    this.tweens.push(tween = TweenMax.to(coin2.scale, {
                        duration: duration / 10,
                        x: 1.4,
                        y: 1.4,
                        yoyo: true,
                        repeat: 1,
                        onComplete: () => {
                            coin2.visible = false;
                            resolve();
                        },
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
        this.coinContainer.removeChild(coin1);
        this.coinContainer.removeChild(coin2);
        this.coinContainer.removeChild(coinContainer);
        this.coinContainer.removeChild(rope);
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
            coin.scale.set(1 + (sinStrength.value + Math.cos(corner) * .3 * sinStrength.value));
            prevPosition.set(coinContainer.x, coinContainer.y);
            let p: Point = points[0];
            p.set(coinContainer.x - Math.sin(coinContainer.rotation) * coin.y, coinContainer.y + Math.cos(coinContainer.rotation) * coin.y);
            /*coin3d?.rotationQuaternion.setEulerAngles(0, coinAngle, 0);
            coin3dMesh.scale.set(1 + (Math.sin(corner + Math.PI / 4) * .01 * sinStrength.value));
            coin3d?.position.set(p.x / 25.5, -p.y / 25.5 * sqrt2, 0);*/
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

    getSitBySitPlace(messagePlace: SitPlace): Sit {
        return this.sits.find(sit => sit.sitPlace == messagePlace);
    }

    getSitById(id: number): Sit {
        return this.sits.find(sit => sit.roundUserData?.config.id == id);
    }

    onGameScaleChanged() {
        let propsMinX: number = Math.min(DominoGame.instance.screenW / 2, 1600);
        let propsMinY: number = Math.min(DominoGame.instance.screenH / 2, 1400);

        this.sits.forEach(sit => {
            switch (sit.sitPlace) {
                case SitPlace.TOP:
                    sit.x = 180;
                    sit.y = -DominoGame.instance.screenH / 2 + 130;
                    break;
                case SitPlace.LEFT:
                    sit.x = -propsMinX + 135;
                    sit.y = -100;
                    break;
                case SitPlace.RIGHT:
                    sit.x = propsMinX - 135;
                    break;
                case SitPlace.BOTTOM:
                    let left: number = 1500;
                    if (DominoGame.instance.screenW > left) {
                        sit.x = -820;
                        sit.y = DominoGame.instance.screenH / 2 - 200;
                    } else {
                        sit.x = -820 - (DominoGame.instance.screenW - left) / 2;
                        sit.y = DominoGame.instance.screenH / 2 - 200 + (DominoGame.instance.screenW - left) / 2;
                    }

                    break;
            }
        });
        dispatchEvent(new MessageEvent(GameEvents.SITS_RESIZED, {
            data: {
                top: this.getSitBySitPlace(SitPlace.TOP),
                left: this.getSitBySitPlace(SitPlace.LEFT),
                right: this.getSitBySitPlace(SitPlace.RIGHT),
            }
        }));
    }

    clear() {
        this.sits.forEach(sit => {
            sit.setRoundUserData(null);
        });
    }

    hideWinner() {
        this.sits.forEach(sit => {
            sit.showWinner(false);
        });
    }

    destroy() {
        removeEventListener(GameEvents.FLY_POINTS, this.onFlyPointsBindThis);
        this.onFlyPointsBindThis = undefined;

        let tween: TweenMax;
        while (this.tweens.length) {
            tween = this.tweens.shift();
            tween.kill();
        }

        this.tweens = undefined;

        this.clearSits();

        this.removeChild(this.topRound);
        this.removeChild(this.topRound10);
        this.removeChild(this.bottomRound);
        this.removeChild(this.bottomRound10);

        this.topRound.destroy();
        this.topRound10.destroy();
        this.bottomRound.destroy();
        this.bottomRound10.destroy();

        this.topRound = undefined;
        this.topRound10 = undefined;
        this.bottomRound = undefined;
        this.bottomRound10 = undefined;

        super.destroy();
    }

    async scoring(topScore: number, bottomScore: number): Promise<void> {
        let _self = this;
        if (!WindowFocusController.documentVisible) {
            return;
        }
        await Timeout.seconds(.7);
        if (!WindowFocusController.documentVisible) {
            return;
        }
        if (topScore == 0 && bottomScore == 0) {
            topScore = bottomScore = ActiveData.gameStateData.pieces.interfaces.filter(piece => piece.side == SitPlace.BOTTOM && piece.place == PiecePlace.WORKSET).reduce<number>((previousValue: number, currentValue: IPieceData) => {
                return previousValue + currentValue.values[0] + currentValue.values[1];
            }, 0);
        }

        let roundDraw: boolean = topScore == bottomScore;
        let drawOrDeadEnd: boolean = roundDraw || this.roundEndedWithDeadEnd;

        this.topRound.setValue(drawOrDeadEnd ? topScore : topScore - 10);
        this.bottomRound.setValue(drawOrDeadEnd ? bottomScore : bottomScore - 10);

        this.topRound10.y = this.topRound.y = 100;
        this.bottomRound10.y = this.bottomRound.y = -100;

        this.bottomRound.x = this.topRound.x = drawOrDeadEnd ? 0 : -70;
        this.bottomRound10.x = this.topRound10.x = drawOrDeadEnd ? 0 : 70;

        this.topRound.alpha = 0;
        this.topRound10.alpha = 0;
        this.bottomRound.alpha = 0;
        this.bottomRound10.alpha = 0;
        this.topRound.scale.set(.3);
        this.topRound10.scale.set(.3);
        this.bottomRound.scale.set(.3);
        this.bottomRound10.scale.set(.3);

        if (roundDraw) {
            this.topRound.visible = true;
            this.topRound10.visible = false;
            this.bottomRound.visible = true;
            this.bottomRound10.visible = false;
        } else {
            this.topRound.visible = !bottomScore;
            this.topRound10.visible = !bottomScore && !this.roundEndedWithDeadEnd;
            this.bottomRound.visible = !topScore;
            this.bottomRound10.visible = !topScore && !this.roundEndedWithDeadEnd;
        }

        let promises: Promise<void>[] = [];
        let goScale: number = .9;
        let topSit: Sit = this.getSitBySitPlace(SitPlace.TOP);
        let bottomSit: Sit = this.getSitBySitPlace(SitPlace.BOTTOM);
        roundDraw || SoundsPlayer.playPointsSound((topScore ? topSit : bottomSit).getNextScoreIndex());
        promises.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound.scale, {duration: .4, x: goScale, y: goScale, ease: Back.easeOut})));
        promises.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound10.scale, {duration: .4, x: goScale, y: goScale, ease: Back.easeOut})));
        promises.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound.scale, {duration: .4, x: goScale, y: goScale, ease: Back.easeOut})));
        promises.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound10.scale, {duration: .4, x: goScale, y: goScale, ease: Back.easeOut})));
        promises.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound, {duration: .4, alpha: 1, ease: Back.easeOut})));
        promises.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound10, {duration: .4, alpha: 1, ease: Back.easeOut})));
        promises.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound, {duration: .4, alpha: 1, ease: Back.easeOut})));
        promises.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound10, {duration: .4, alpha: 1, ease: Back.easeOut})));
        await Promise.all(promises);

        if (!WindowFocusController.documentVisible) {
            setScoreAndHideRounds();
            return;
        }

        if (!drawOrDeadEnd) {
            await Timeout.seconds(.7);
            if (!WindowFocusController.documentVisible) {
                return;
            }
            let promises2: Promise<void>[] = [];
            promises2.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound, {duration: .3, x: 0, ease: Sine.easeIn})));
            promises2.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound10, {duration: .3, x: 0, ease: Sine.easeIn})));
            promises2.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound, {duration: .3, x: 0, ease: Sine.easeIn})));
            promises2.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound10, {duration: .3, x: 0, ease: Sine.easeIn})));
            await Promise.all(promises2);
            if (!WindowFocusController.documentVisible) {
                setScoreAndHideRounds();
                return;
            }

            this.topRound10.visible = false;
            this.bottomRound10.visible = false;

            this.topRound.setValue(topScore);
            this.bottomRound.setValue(bottomScore);

            this.topRound.jump();
            this.bottomRound.jump();
        }

        await Timeout.seconds(.7);
        if (!WindowFocusController.documentVisible) {
            setScoreAndHideRounds();
            return;
        }

        if (roundDraw) {
            let promises: Promise<void>[] = [];
            let goScale: number = .3;
            promises.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound.scale, {duration: .4, x: goScale, y: goScale, ease: Back.easeIn})));
            promises.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound.scale, {duration: .4, x: goScale, y: goScale, ease: Back.easeIn})));
            promises.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound, {duration: .4, alpha: 0, ease: Back.easeIn})));
            promises.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound, {duration: .4, alpha: 0, ease: Back.easeIn})));
            await Promise.all(promises);
            _self.roundsVisible = false;
            return;
        }

        let promises3: Promise<void>[] = [];
        promises3.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound, {duration: .3, x: topSit.x + topSit.playerScore.x, ease: Linear.easeNone})));
        promises3.push(WindowFocusController.wrapTween(TweenMax.to(this.topRound, {duration: .3, y: topSit.y, ease: Sine.easeIn})));
        promises3.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound, {duration: .3, x: bottomSit.x + bottomSit.playerScore.x, ease: Linear.easeNone})));
        promises3.push(WindowFocusController.wrapTween(TweenMax.to(this.bottomRound, {duration: .3, y: bottomSit.y, ease: Sine.easeIn})));
        await Promise.all(promises3);
        setScoreAndHideRounds();

        function setScoreAndHideRounds() {
            topSit.updateScore(false, true);
            bottomSit.updateScore(false, true);
            _self.roundsVisible = false;
        }
    }

    clearSits() {
        let sit: Sit;
        while (this.sits.length) {
            sit = this.sits.shift();
            sit.destroy();
        }
        this.sits = undefined;
    }

    private createChildren() {
        this.sits = [SitPlace.TOP, SitPlace.BOTTOM, SitPlace.LEFT, SitPlace.RIGHT].map(sitPlace => new Sit(sitPlace));

        this.topRound = new ScoreRound();
        this.topRound10 = new ScoreRound(10);
        this.bottomRound = new ScoreRound();
        this.bottomRound10 = new ScoreRound(10);
    }

    private initChildren() {
        this.roundsVisible = false;
        this.topRound10.setValue(10, undefined, true);
        this.bottomRound10.setValue(10, undefined, true);
    }

    clearAbsentVals() {
        this.sits.forEach(sit => sit.absentVals.update([]));
    }

    private addChildren() {
        this.sits.forEach(sit => this.addChild(sit));
        this.addChild(this.coinContainer);

        this.addChild(this.topRound);
        this.addChild(this.topRound10);
        this.addChild(this.bottomRound);
        this.addChild(this.bottomRound10);
    }

    updateCoins() {
        this.sits.forEach(sit => sit.roundUserData?.side == SitPlace.NONE || sit.updateCoins());
    }

    resetPointsSoundIndexes() {
        this.sits.forEach(sit => sit.resetPointsIndex());
    }

    exitTimer() {
        this.sits.forEach(sit => sit.exitTimer());
    }
}