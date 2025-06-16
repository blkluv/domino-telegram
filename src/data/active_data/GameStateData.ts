import {GamePhase} from "../../dynamic_data/GamePhase";
import {IPieceData} from "../../dynamic_data/IPieceData";
import {IPieceJointData} from "../../dynamic_data/IPieceJointData";
import {IPossibleMoveData} from "../../dynamic_data/IPossibleMoveData";
import {ISocketGameState} from "../../dynamic_data/ISocketGameState";
import {SitPlace} from "../../dynamic_data/SitPlace";
import {DynamicData} from "../../DynamicData";
import {ActiveData} from "../ActiveData";
import {ArrayWrap} from './base/static_config_data/ArrayWrap';
import {BaseData} from './base/static_config_data/BaseData';
import {PieceJointData} from "./game_state/piece_data/PieceJointData";
import {PieceData} from "./game_state/PieceData";
import {PlayersSlotsData} from "./game_state/PlayersSlotsData";
import {PossibleMoveData} from "./game_state/PossibeMoveData";


export class GameStateData extends BaseData {
    pieces: ArrayWrap<PieceData, IPieceData>;
    possibleMoves: ArrayWrap<PossibleMoveData, IPossibleMoveData>;
    joints: ArrayWrap<PieceJointData, IPieceJointData>;
    playersSlots: PlayersSlotsData;
    private _timerEndMillis: number;

    constructor(public config: ISocketGameState) {
        super();

        this.pieces = new ArrayWrap<PieceData, IPieceData>(PieceData, this.config.pieces);
        this.possibleMoves = new ArrayWrap<PossibleMoveData, IPossibleMoveData>(PossibleMoveData, this.config.possibleMoves);
        this.joints = new ArrayWrap<PieceJointData, IPieceJointData>(PieceJointData, this.config.joints);
        this.playersSlots = new PlayersSlotsData(this.config.playersSlots);
        this.timerEndDelayMillis = config.timerEndDelayMillis;
    }

    get exitPlayer(): SitPlace {
        return this.config.exitPlayer || SitPlace.NONE;
    }

    set exitPlayer(value: SitPlace) {
        this.config.exitPlayer = value || SitPlace.NONE;
        DynamicData.exitPlayer = this.config.exitPlayer;
        ActiveData.addEventToPool<SitPlace>(this, GameStateEvents.EXIT_PLAYER_CHANGED, this.config!.exitPlayer);
    }

    get phase(): GamePhase {
        return this.config.phase || GamePhase.NONE;
    }

    set phase(value: GamePhase) {
        this.config.phase = value || GamePhase.NONE;
        if (value != GamePhase.END) {
            DynamicData.exitPlayer = SitPlace.NONE;
        }
        ActiveData.addEventToPool<GamePhase>(this, GameStateEvents.PHASE_CHANGED, this.config!.phase);
    }

    get turn(): SitPlace {
        return this.config.turn || SitPlace.NONE;
    }

    set turn(value: SitPlace | null) {
        this.config.turn = value || SitPlace.NONE;
        ActiveData.addEventToPool<SitPlace>(this, GameStateEvents.TURN_CHANGED, this.config!.turn);
    }

    get targetScore(): number {
        return this.config.targetScore;
    }

    set targetScore(value: number) {
        this.config.targetScore = value;
        ActiveData.addEventToPool<number>(this, GameStateEvents.TARGET_SCORE_CHANGED, this.config!.targetScore);
    }

    get syncDelayMillis(): number {
        return this.config.syncDelayMillis;
    }

    set syncDelayMillis(value: number) {
        this.config.syncDelayMillis = value;
        ActiveData.addEventToPool<number>(this, GameStateEvents.SYNC_DELAY_MILLIS_CHANGED, this.config!.syncDelayMillis);
    }

    get timerEndDelayMillis(): number {
        return this.config.timerEndDelayMillis || 0;
    }

    get timerEndMillis(): number {
        return this._timerEndMillis;
    }

    set timerEndDelayMillis(value: number | null) {
        value |= 0;
        this.config.timerEndDelayMillis = value;
        this._timerEndMillis = Date.now() + value;
        ActiveData.addEventToPool<number>(this, GameStateEvents.TIMER_END_DELAY_MILLIS_CHANGED, this.config!.timerEndDelayMillis);
    }

    get timerDurationMillis(): number {
        return this.config.timerDurationMillis ?? 0;
    }

    set timerDurationMillis(value: number) {
        this.config.timerDurationMillis = value ?? 0;
        ActiveData.addEventToPool<number>(this, GameStateEvents.TIMER_DURATION_MILLIS_CHANGED, this.config!.timerDurationMillis);
    }

    get round(): number {
        return this.config.round;
    }

    set round(value: number) {
        this.config.round = value;
        ActiveData.addEventToPool<number>(this, GameStateEvents.ROUND_CHANGED, this.config!.round);
    }

    get takingUnused(): boolean {
        return this.config.takingUnused ?? false;
    }

    set takingUnused(value: boolean) {
        this.config.takingUnused = value ?? false;
        ActiveData.addEventToPool<boolean>(this, GameStateEvents.TAKING_UNUSED_CHANGED, this.config!.takingUnused);
    }
}

export enum GameStateEvents {
    PHASE_CHANGED = "GameStateEvents.PHASE_CHANGED",
    TURN_CHANGED = "GameStateEvents.TURN_CHANGED",
    TARGET_SCORE_CHANGED = "GameStateEvents.TARGET_SCORE_CHANGED",
    SYNC_DELAY_MILLIS_CHANGED = "GameStateEvents.SYNC_DELAY_MILLIS_CHANGED",
    TIMER_END_DELAY_MILLIS_CHANGED = "GameStateEvents.TIMER_END_DELAY_MILLIS_CHANGED",
    TIMER_DURATION_MILLIS_CHANGED = "GameStateEvents.TIMER_DURATION_MILLIS_CHANGED",
    ROUND_CHANGED = "GameStateEvents.ROUND_CHANGED",
    TAKING_UNUSED_CHANGED = "GameStateEvents.TAKING_UNUSED_CHANGED",
    EXIT_PLAYER_CHANGED = "GameStateEvents.EXIT_PLAYER_CHANGED",
}
