import gsap, {Sine} from "gsap";
import {Sprite, Text} from "pixi.js";
import {PieceDataEvent} from "../../../../../data/active_data/game_state/PieceData";
import {GameStateData, GameStateEvents} from "../../../../../data/active_data/GameStateData";
import {GamePhase} from "../../../../../dynamic_data/GamePhase";
import {PiecePlace} from "../../../../../dynamic_data/PiecePlace";
import {DynamicData} from "../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {GameMode} from "../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class BazarIcon extends Sprite {
    private back: Sprite;
    private text: Text;
    private gameStateData: GameStateData;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.alpha = 0;
    }

    createChildren(): void {
        this.back = DisplayObjectFactory.createSprite("table/bazar/button");
        this.text = TextFactory.createCommissioner({fontSize: 36, fill: 0xfef3d7});
    }

    addChildren(): void {
        this.addChild(this.back);
        this.addChild(this.text);
    }

    initChildren(): void {
        Pivot.center(this.back);
        this.text.y = -18;

        this.text.style.strokeThickness = 4;
        this.text.style.stroke = 0x855435;
    }

    setGameStateData(socketGameState: GameStateData): void {
        this.gameStateData?.removeListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);
        this.gameStateData?.pieces.classes.forEach(pieceData => pieceData.removeListener(PieceDataEvent.UNUSED_IDX_CHANGED, this.onUnusedIdxChanged, this));

        this.gameStateData = socketGameState;

        this.gameStateData.addListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);
        this.gameStateData.pieces.classes.forEach(pieceData => pieceData.addListener(PieceDataEvent.UNUSED_IDX_CHANGED, this.onUnusedIdxChanged, this));
        this.onUnusedIdxChanged();
        this.show(socketGameState.phase == GamePhase.PLAYING);
    }

    private onUnusedIdxChanged(): void {
        this.setValue(this.gameStateData.pieces.interfaces.filter(pieceData => pieceData.place == PiecePlace.UNUSED).length);
    }

    setValue(value: number): void {
        this.text.text = value;
        Pivot.center(this.text);
    }

    onPhaseChanged(phase?: GamePhase): void {
        this.show(phase == GamePhase.PLAYING);
    }

    show(value: boolean): void {
        let show: boolean = value && [GameMode.CLASSIC, GameMode.FIVES].includes(DynamicData.socketGameRequest.mode);
        gsap.to(this, {duration: .3, alpha: show ? 1 : 0, ease: Sine.easeOut});
    }

    destroy(): void {
        this.gameStateData?.removeListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);
        this.gameStateData?.pieces.classes.forEach(pieceData => pieceData.removeListener(PieceDataEvent.PLACE_CHANGED, this.onUnusedIdxChanged, this));
        this.gameStateData = null;

        this.removeChild(this.back);
        this.removeChild(this.text);

        this.back.destroy();
        this.text.destroy();

        this.back = undefined;
        this.text = undefined;

        super.destroy();
    }
}
