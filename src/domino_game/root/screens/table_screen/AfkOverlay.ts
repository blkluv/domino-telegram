import gsap, {Sine} from "gsap";
import {NineSlicePlane, Rectangle, Sprite} from "pixi.js";
import {DominoGame} from "../../../../app";
import {LanguageText, ShineParticles, ScreenCovering, DisplayObjectFactory, Pivot} from "@azur-games/pixi-vip-framework";
import {RoundUserData, RoundUserDataEvent} from "../../../../data/active_data/game_state/players_data/RoundUserData";
import {GameStateData, GameStateEvents} from "../../../../data/active_data/GameStateData";
import {GamePhase} from "../../../../dynamic_data/GamePhase";
import {SocketService} from "../../../../services/SocketService";


export class AfkOverlay extends ScreenCovering {
    private gameStateData: GameStateData;
    private roundUserData: RoundUserData;
    private ellipse: Sprite;
    private messageBackground: NineSlicePlane;
    private message: LanguageText;
    private leftParticles: ShineParticles;
    private rightParticles: ShineParticles;

    constructor() {
        super(.83, true, undefined, 0x060114);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onGameScaleChanged();
        this.interactive = this.interactiveChildren = false;
        this.alpha = 0;
    }

    createChildren(): void {
        this.ellipse = DisplayObjectFactory.createSprite("table/afk/bg_ellipse");
        this.messageBackground = DisplayObjectFactory.createNineSlicePlane("table/afk/message_bg", 440, 20, 440, 20);
        this.message = new LanguageText({key: "tap to continue", fontSize: 40,});
        this.leftParticles = new ShineParticles("table/afk/particle", 5, new Rectangle(0, 0, 80, 300));
        this.rightParticles = new ShineParticles("table/afk/particle", 5, new Rectangle(0, 0, 80, 300));
    }

    addChildren(): void {
        this.addChild(this.ellipse);
        this.addChild(this.messageBackground);
        this.addChild(this.message);
        this.addChild(this.leftParticles);
        this.addChild(this.rightParticles);
    }

    initChildren(): void {
        this.ellipse.scale.set(10);
        this.messageBackground.height = 120;

        Pivot.center(this.leftParticles);
        Pivot.center(this.rightParticles);
        Pivot.center(this.messageBackground);
        Pivot.center(this.message);

        this.leftParticles.angle = -90;
        this.rightParticles.angle = 90;
    }

    onOverlayClick(): void {
        SocketService.noAfk();
    }

    onGameScaleChanged(): void {
        super.onGameScaleChanged();
        if (!this.ellipse) {
            return;
        }

        Pivot.center(this.ellipse);
        this.ellipse.y = DominoGame.instance.screenH / 2 - this.ellipse.height / 2;
        this.messageBackground.y = DominoGame.instance.screenH / 2 - 120;
        this.message.y = this.messageBackground.y - 5;
        this.leftParticles.y = this.message.y + 45;
        this.leftParticles.x = -300 - this.message.width / 2;
        this.rightParticles.y = this.message.y - 35;
        this.rightParticles.x = 300 + this.message.width / 2;
    }

    setGameStateData(socketGameState: GameStateData): void {
        this.gameStateData?.removeListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);
        this.gameStateData = socketGameState;
        this.gameStateData.addListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);
        this.setUserData(socketGameState.playersSlots.bottom);
    }

    setUserData(roundUserData: RoundUserData): void {
        if (this.roundUserData === roundUserData) {
            return;
        }
        this.roundUserData?.removeListener(RoundUserDataEvent.AFK_CHANGED, this.onAfkChanged, this);
        this.roundUserData = roundUserData;
        this.roundUserData.addListener(RoundUserDataEvent.AFK_CHANGED, this.onAfkChanged, this);
        this.onAfkChanged();
    }

    onPhaseChanged(): void {
        this.show(this.roundUserData.afk && this.gameStateData.phase == GamePhase.PLAYING);
    }

    onAfkChanged(): void {
        this.show(this.roundUserData.afk && this.gameStateData.phase == GamePhase.PLAYING);
    }

    show(value: boolean): void {
        this.interactive = this.interactiveChildren = value;
        gsap.to(this, {duration: .5, alpha: value ? 1 : 0, ease: Sine.easeOut});
    }

    destroy(): void {
        this.roundUserData.removeListener(RoundUserDataEvent.AFK_CHANGED, this.onAfkChanged, this);
        this.gameStateData.removeListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);
        this.roundUserData = null;
        this.gameStateData = null;

        this.removeChild(this.ellipse);
        this.removeChild(this.messageBackground);
        this.removeChild(this.message);
        this.removeChild(this.leftParticles);
        this.removeChild(this.rightParticles);

        this.ellipse.destroy();
        this.messageBackground.destroy();
        this.message.destroy();
        this.leftParticles.destroy();
        this.rightParticles.destroy();

        this.ellipse = null;
        this.messageBackground = null;
        this.message = null;
        this.leftParticles = null;
        this.rightParticles = null;

        super.destroy();
    }
}
