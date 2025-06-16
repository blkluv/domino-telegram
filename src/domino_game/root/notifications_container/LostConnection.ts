import {LoaderService, Pivot, Timeout} from "@azur-games/pixi-vip-framework";
import {Linear, TweenMax} from "gsap";
import {Sprite} from "pixi.js";
import {DominoGame} from "../../../app";
import {ActiveData} from "../../../data/ActiveData";
import {GameEvents} from "../../../GameEvents";
import {ScreenType} from "../screens/ScreenType";


export class LostConnection extends Sprite {
    private icon: Sprite;
    private onConnectionChangeBindThis: (e: Event) => void;
    private blinkTween: TweenMax;
    private closeTween: TweenMax;
    private _shown: boolean;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.resize();

        this.onConnectionChangeBindThis = this.onConnectionChange.bind(this);
        addEventListener(GameEvents.CONNECTION_CHANGE, this.onConnectionChangeBindThis);

        addEventListener(GameEvents.SCREEN_CHANGE, this.switchScreens.bind(this));

        this.visible = false;
    }

    async switchScreens() {
        await Timeout.milliseconds(1000);
        this.resize();
    }

    createChildren() {
        this.icon = new Sprite(LoaderService.getTexture("common/no_connection"));
    }

    addChildren() {
        this.addChild(this.icon);
    }

    initChildren() {
        Pivot.center(this.icon);
    }

    resize() {
        let tableScreen: boolean = DominoGame.instance.root?.screens.currentScreen?.screenType == ScreenType.TABLE;
        this.y = -DominoGame.instance.screenH / 2 + (tableScreen ? 120 : 100);
        this.x = tableScreen ? -120 : 400;
    }

    onConnectionChange(e: MessageEvent) {
        let connected: boolean = e.data;
        this.resize();
        this.show(!connected);
        //DominoGame.instance.root.interactive = DominoGame.instance.root.interactiveChildren = connected;
        if (ActiveData.gameStateData) {
            ActiveData.gameStateData.playersSlots.bottom.alive = connected;
            ActiveData.dispatchEventsPool();
        }
    }

    async show(value: boolean) {
        if (this._shown == value) {
            return;
        }
        this._shown = value;
        this.blinkTween?.kill();
        if (value) {
            this.icon.alpha = 1;
            this.visible = true;
            this.blinkTween = TweenMax.to(this.icon, .8, {
                alpha: .5,
                repeat: -1,
                yoyo: true,
                ease: Linear.easeNone,
            });
        } else {
            await this.animateClosing();
            this.visible = false;

            this.blinkTween?.kill();
            this.blinkTween = null;
            this.closeTween?.kill();
            this.closeTween = null;
        }
    }

    animateClosing() {
        return new Promise(resolve => this.closeTween = TweenMax.to(this.icon, .3, {
            alpha: 0,
            ease: Linear.easeNone,
            onComplete: resolve
        }));
    }

    destroy() {
        removeEventListener(GameEvents.CONNECTION_CHANGE, this.onConnectionChangeBindThis);
        this.onConnectionChangeBindThis = null;

        this.blinkTween?.kill();
        this.blinkTween = null;
        this.closeTween?.kill();
        this.closeTween = null;

        this.removeChild(this.icon);

        this.icon.destroy();

        this.icon = null;

        super.destroy();
    }
}