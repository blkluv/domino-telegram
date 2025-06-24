import {ColorMatrixFilter} from "@pixi/filter-color-matrix";
import {Back, Sine} from "gsap";
import {TweenMax} from "gsap/gsap-core";
import {BLEND_MODES, NineSlicePlane, Sprite} from "pixi.js";
import {DominoGame} from "../../../app";
import {AppearType, WindowFocusController} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../GameEvents";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Timeout} from "@azur-games/pixi-vip-framework";
import {StaticData} from "../../../StaticData";
import {BaseScreen} from "./BaseScreen";
import {GameButton} from "./lobby_screen/GameButton";
import {PlayerBlock} from "./lobby_screen/PlayerBlock";
import {ScreenType} from "./ScreenType";


export class LobbyScreen extends BaseScreen {
    private background: Sprite;
    private vignette: NineSlicePlane
    private playerBlock: PlayerBlock;
    private gameButtons: GameButton[] = []
    private filter: ColorMatrixFilter;
    private filterTween1: TweenMax;
    private filterTween2: TweenMax;
    private wavesTweens1: TweenMax[] = [];
    private wavesTweens2: TweenMax[] = [];
    private onWindowFocusChangedBindThis: (e: MessageEvent) => void;

    constructor() {
        super(ScreenType.LOBBY, true);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.createGameButtons()
        this.onGameScaleChanged();
        this.appearChildren();

        this.filter = new ColorMatrixFilter();
        this.background.filters = [this.filter];
        this.filterTween1 = TweenMax.to(this, {duration: 3, saturate1: .5, yoyo: true, ease: Sine.easeInOut, repeat: -1});
        this.filterTween2 = TweenMax.to(this, {duration: 3.61, saturate2: .5, yoyo: true, ease: Sine.easeInOut, repeat: -1});

        this.addWave();

        this.onWindowFocusChangedBindThis = this.onWindowFocusChanged.bind(this);

        addEventListener(GameEvents.FOCUS_CHANGED, this.onWindowFocusChangedBindThis);
    }

    onWindowFocusChanged(): void {
        WindowFocusController.focused ? this.addWave() : this.killWaves();
    }

    private _saturate1: number = 0;

    private get saturate1(): number {
        return this._saturate1;
    }

    private set saturate1(value: number) {
        this._saturate1 = value;
        this.filter.saturate(this._saturate1 + this._saturate2);
        this.filter.contrast((this._saturate1 + this._saturate2) / 2, false);
    }

    private _saturate2: number = 0;

    private get saturate2(): number {
        return this._saturate2;
    }

    private set saturate2(value: number) {
        this._saturate2 = value;
        this.filter.saturate(this._saturate1 + this._saturate2);
        this.filter.contrast((this._saturate1 + this._saturate2) / 2, false);
    }

    async appearChildren(): Promise<void> {
        let speed: number = 1.4;
        let delay: number = .3;
        this.registerAppear(this.vignette, {
            appearType: AppearType.FADE_IN,
            ease: Sine.easeOut,
            startValue: 0,
            duration: 1 / speed,
            delay: delay / speed
        });
        this.registerAppear(this.playerBlock, {
            appearType: AppearType.MOVE_FROM_LEFT,
            ease: Back.easeOut,
            startValue: this.playerBlock.x - 500,
            duration: .5 / speed,
            delay: delay + 1 / speed
        });
        this.registerAppear(this.playerBlock, {
            appearType: AppearType.FADE_IN,
            ease: Sine.easeOut,
            startValue: 0,
            duration: .5 / speed,
            delay: delay + 1 / speed
        });
        await this.appear();
    }

    createGameButtons(){
        this.gameButtons = StaticData.gamesConfig.map((config, i) => {
            let button: GameButton = new GameButton(config);
            this.addChild(button);
            return button;
        })

    }

    createChildren() {
        this.background = DisplayObjectFactory.createSprite("lobby/bg");
        this.vignette = DisplayObjectFactory.createNineSlicePlane("lobby/vinetka_bg");
        this.playerBlock = new PlayerBlock();
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.vignette);
        this.addChild(this.playerBlock);
    }

    initChildren() {
        Pivot.center(this.background);
    }

    onGameScaleChanged() {
        this.vignette.width = DominoGame.instance.screenW;
        this.vignette.height = DominoGame.instance.screenH;
        this.resizeBackckground();
        Pivot.center(this.vignette);

        this.playerBlock.x = -DominoGame.instance.screenW / 2;
        this.playerBlock.y = -DominoGame.instance.screenH / 2;
        this.gameButtons.forEach((button, i) => {
            button.y = i * 120 - (DominoGame.instance.screenH * .3);
        })
    }

    destroy(): void {
        removeEventListener(GameEvents.FOCUS_CHANGED, this.onWindowFocusChangedBindThis);
        this.onWindowFocusChangedBindThis = null;

        this.killWaves();
        this.wavesTweens1 = undefined;
        this.wavesTweens2 = undefined;

        this.background.filters = null;

        this.filter.destroy();
        this.filter = null;

        this.removeChild(this.background);
        this.removeChild(this.vignette);
        this.removeChild(this.playerBlock);

        this.background.destroy({children: true});
        this.vignette.destroy();
        this.playerBlock.destroy();

        this.background = undefined;
        this.vignette = undefined;
        this.playerBlock = undefined;

        super.destroy();
    }

    private resizeBackckground() {
        if (DominoGame.instance.screenW / DominoGame.instance.screenH > this.background.texture.width / this.background.texture.height) {
            this.background.width = DominoGame.instance.screenW;
            this.background.scale.y = this.background.scale.x;

        } else {
            this.background.height = DominoGame.instance.screenH;
            this.background.scale.x = this.background.scale.y;
        }

        Pivot.center(this.background);
    }

    private killWaves(): void {
        let tween: TweenMax;
        while (this.wavesTweens1?.length) {
            tween = this.wavesTweens1.shift();
            tween.kill();
        }
        let tween2: TweenMax;
        while (this.wavesTweens2?.length) {
            tween2 = this.wavesTweens2.shift();
            tween2.kill();
        }
        this.filterTween1.kill();
        this.filterTween2.kill();
    }

    private async addWave() {
        if (this._destroyed || !WindowFocusController.focused) {
            return;
        }
        let wave: Sprite = DisplayObjectFactory.createSprite("lobby/waves");
        this.background.addChild(wave);
        wave.blendMode = BLEND_MODES.OVERLAY;
        wave.x = 1276;
        wave.y = 983;
        wave.alpha = 0;
        wave.scale.set(.85);
        let tween1: TweenMax;
        let tween2: TweenMax;
        await Promise.all([
            new Promise<void>(async resolve => {
                await Timeout.seconds(2.5);
                this.addWave();
                resolve();
            }),
            new Promise<void>(resolve => this.wavesTweens1.push(tween1 = TweenMax.to(wave.scale, {duration: 5, x: 1, y: 1, ease: Sine.easeInOut, yoyo: true, repeat: 1, onComplete: resolve}))),
            new Promise<void>(resolve => this.wavesTweens2.push(tween2 = TweenMax.to(wave, {duration: 2.5, alpha: 1, ease: Sine.easeInOut, yoyo: true, repeat: 1, onComplete: resolve}))),
        ]);
        if (this._destroyed) {
            return;
        }
        this.wavesTweens1.splice(this.wavesTweens1.indexOf(tween1, 1));
        this.wavesTweens2.splice(this.wavesTweens1.indexOf(tween2, 1));
        this.background.removeChild(wave);
        wave.destroy();
    }
}