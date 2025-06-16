import {DominoNumber} from "../../../../domino_game/root/screens/table_screen/domino_logic/DominoNumber";
import {IRoundUser, UserState} from "../../../../dynamic_data/IRoundUser";
import {SitPlace} from "../../../../dynamic_data/SitPlace";
import {ActiveData} from "../../../ActiveData";
import {ArrayWrap} from "../../base/static_config_data/ArrayWrap";
import {BaseData} from "../../base/static_config_data/BaseData";
import {NumberData} from "../../base/static_config_data/NumberData";


export class RoundUserData extends BaseData {

    absentVals: ArrayWrap<NumberData, DominoNumber>;

    constructor(public config: IRoundUser) {
        super();

        if (!this.config) {
            return;
        }

        this.absentVals = new ArrayWrap<NumberData, DominoNumber>(NumberData, config.absentVals || []);
    }

    get fake(): boolean {
        return this.config.fake;
    }

    set fake(value: boolean) {
        this.config.fake = value;
        ActiveData.addEventToPool<boolean>(this, RoundUserDataEvent.FAKE_CHANGED, this.config.fake);
    }

    get alive(): boolean {
        return this.config.alive;
    }

    set alive(value: boolean) {
        this.config.alive = value;
        ActiveData.addEventToPool<boolean>(this, RoundUserDataEvent.ALIVE_CHANGED, this.config.alive);
    }

    get side(): SitPlace {
        return this.config.side || SitPlace.NONE;
    }

    set side(value: SitPlace) {
        this.config.side = value || SitPlace.NONE;
        ActiveData.addEventToPool<SitPlace>(this, RoundUserDataEvent.SIDE_CHANGED, this.config.side);
    }

    get tableId(): number {
        return this.config.tableId;
    }

    set tableId(value: number) {
        this.config.tableId = value;
        ActiveData.addEventToPool<number>(this, RoundUserDataEvent.TABLE_ID_CHANGED, this.config.tableId);
    }

    get afk(): boolean {
        return this.config.afk;
    }

    set afk(value: boolean) {
        this.config.afk = value;
        ActiveData.addEventToPool<boolean>(this, RoundUserDataEvent.AFK_CHANGED, this.config.afk);
    }

    get moveScore(): number {
        return this.config.moveScore ?? 0;
    }

    set moveScore(value: number) {
        this.config.moveScore = value ?? 0;
        ActiveData.addEventToPool<number>(this, RoundUserDataEvent.MOVE_SCORE_CHANGED, this.config.moveScore);
    }

    get roundsWon(): number {
        return this.config.roundsWon ?? 0;
    }

    set roundsWon(value: number) {
        this.config.roundsWon = value ?? 0;
        ActiveData.addEventToPool<number>(this, RoundUserDataEvent.MOVE_SCORE_CHANGED, this.config.roundsWon);
    }

    get winScore(): number {
        return this.config.winScore ?? 0;
    }

    set winScore(value: number) {
        this.config.winScore = value ?? 0;
        ActiveData.addEventToPool<number>(this, RoundUserDataEvent.WIN_SCORE_CHANGED, this.config.winScore);
    }

    get score(): number {
        return this.config.score ?? 0;
    }

    set score(value: number) {
        if (this.config.score == value) {
            return;
        }
        this.config.score = value ?? 0;
        ActiveData.addEventToPool<number>(this, RoundUserDataEvent.SCORE_CHANGED, this.config.score);
    }

    get name(): string {
        return this.config.name || "";
    }

    set name(value: string) {
        this.config.name = value || "";
        ActiveData.addEventToPool<number>(this, RoundUserDataEvent.NAME_CHANGED, this.config.score);
    }

    get id(): number {
        return this.config.id || -1;
    }

    set id(value: number) {
        this.config.id = value || -1;
        ActiveData.addEventToPool<number>(this, RoundUserDataEvent.ID_CHANGED, this.config.id);
    }

    get icon(): string {
        return this.config.icon || "";
    }

    set icon(value: string) {
        this.config.icon = value || "";
        ActiveData.addEventToPool<number>(this, RoundUserDataEvent.ICON_CHANGED, this.config.score);
    }

    get coins(): number {
        return this.config.coins || -1;
    }

    set coins(value: number) {
        this.config.coins = value || -1;
        ActiveData.addEventToPool<number>(this, RoundUserDataEvent.COINS_CHANGED, this.config.coins);
    }

    get state(): UserState {
        return this.config.state || UserState.NONE;
    }

    set state(value: UserState) {
        this.config.state = value || UserState.NONE;
        ActiveData.addEventToPool<UserState>(this, RoundUserDataEvent.STATE_CHANGED, this.config.state);
    }
}

export enum RoundUserDataEvent {
    FAKE_CHANGED = "RoundUserDataEvent.FAKE_CHANGED",
    ALIVE_CHANGED = "RoundUserDataEvent.ALIVE_CHANGED",
    SIT_PLACE_CHANGED = "RoundUserDataEvent.SIT_PLACE_CHANGED",
    TABLE_ID_CHANGED = "RoundUserDataEvent.TABLE_ID_CHANGED",
    AFK_CHANGED = "RoundUserDataEvent.AFK_CHANGED",
    MOVE_SCORE_CHANGED = "RoundUserDataEvent.MOVE_SCORE_CHANGED",
    PREV_MOVE_SCORE_CHANGED = "RoundUserDataEvent.PREV_MOVE_SCORE_CHANGED",
    WIN_SCORE_CHANGED = "RoundUserDataEvent.WIN_SCORE_CHANGED",
    SCORE_CHANGED = "RoundUserDataEvent.SCORE_CHANGED",
    SIDE_CHANGED = "RoundUserDataEvent.SIDE_CHANGED",
    NAME_CHANGED = "RoundUserDataEvent.NAME_CHANGED",
    ID_CHANGED = "RoundUserDataEvent.NAME_CHANGED",
    ICON_CHANGED = "RoundUserDataEvent.ICON_CHANGED",
    COINS_CHANGED = "RoundUserDataEvent.COINS_CHANGED",
    STATE_CHANGED = "RoundUserDataEvent.STATE_CHANGED",
    ROUNDS_WON_CHANGED = "RoundUserDataEvent.ROUNDS_WON_CHANGED",
}