import {DominoNumber} from "../../../domino_game/root/screens/table_screen/domino_logic/DominoNumber";
import {IPieceData, PieceRot} from "../../../dynamic_data/IPieceData";
import {PiecePlace} from "../../../dynamic_data/PiecePlace";
import {SitPlace} from "../../../dynamic_data/SitPlace";
import {ActiveData} from '../../ActiveData';
import {ArrayWrap} from "../base/static_config_data/ArrayWrap";
import {BaseData} from '../base/static_config_data/BaseData';
import {NumberData} from "../base/static_config_data/NumberData";
import {PieceJointData} from "./piece_data/PieceJointData";


export class PieceData extends BaseData {
    joint: PieceJointData;
    values: ArrayWrap<NumberData, DominoNumber>;
    pos: ArrayWrap<NumberData, number>;

    constructor(public config: IPieceData) {
        super();

        if (!this.config) {
            return;
        }

        this.joint = new PieceJointData(this.config.joint);
        this.values = new ArrayWrap<NumberData, DominoNumber>(NumberData, this.config.values);
        this.pos = new ArrayWrap<NumberData, number>(NumberData, this.config.pos);
    }

    get joker(): boolean {
        return this.config.joker || false;
    }

    set joker(value: boolean | null) {
        this.config.joker = value || false;
        ActiveData.addEventToPool<boolean>(this, PieceDataEvent.JOKER_CHANGED, this.config.joker);
    }

    get shown(): boolean {
        return this.config.shown || false;
    }

    set shown(value: boolean) {
        this.config.shown = value || false;
        ActiveData.addEventToPool<boolean>(this, PieceDataEvent.SHOWN_CHANGED, this.config.shown);
    }

    get pivot(): boolean {
        return this.config.pivot || false;
    }

    set pivot(value: boolean) {
        this.config.pivot = value || false;
        ActiveData.addEventToPool<boolean>(this, PieceDataEvent.PIVOT_CHANGED, this.config.pivot);
    }

    get open(): boolean {
        return this.config.open;
    }

    set open(value: boolean) {
        this.config.open = value;
        ActiveData.addEventToPool<boolean>(this, PieceDataEvent.OPEN_CHANGED, this.config.open);
    }

    get order(): number {
        return this.config.order;
    }

    set order(value: number) {
        this.config.order = value;
        ActiveData.addEventToPool<number>(this, PieceDataEvent.ORDER_CHANGED, this.config.order);
    }

    get score(): number {
        return this.config.score ?? 0;
    }

    set score(value: number) {
        this.config.score = value ?? 0;
        ActiveData.addEventToPool<number>(this, PieceDataEvent.SCORE_CHANGED, this.config.score);
    }

    get place(): PiecePlace {
        return this.config.place || PiecePlace.NONE;
    }

    set place(value: PiecePlace) {
        if (value == this.config.place) {
            return;
        }
        this.config.place = value || PiecePlace.NONE;
        ActiveData.addEventToPool<PiecePlace>(this, PieceDataEvent.PLACE_CHANGED, this.config.place);
    }

    get side(): SitPlace {
        return this.config.side || SitPlace.NONE;
    }

    set side(value: SitPlace) {
        this.config.side = value || SitPlace.NONE;
        ActiveData.addEventToPool<SitPlace>(this, PieceDataEvent.SIDE_CHANGED, this.config.side);
    }

    get rot(): PieceRot {
        return this.config.rot || PieceRot.NONE;
    }

    set rot(value: PieceRot) {
        this.config.rot = value || PieceRot.NONE;
        ActiveData.addEventToPool<PieceRot>(this, PieceDataEvent.ROT_CHANGED, this.config.rot);
    }

    get bottom(): DominoNumber {
        return this.values.getAt(0).value as DominoNumber;
    }

    get top(): DominoNumber {
        return this.values.getAt(1).value as DominoNumber;
    }

    get unusedIdx(): number {
        return this.config.unusedIdx ?? -1;
    }

    set unusedIdx(value: number) {
        this.config.unusedIdx = value ?? -1;
        ActiveData.addEventToPool<number>(this, PieceDataEvent.UNUSED_IDX_CHANGED, this.config.unusedIdx);
    }

}

export enum PieceDataEvent {
    PLACE_CHANGED = "PieceDataEvent.PLACE_CHANGED",
    SIDE_CHANGED = "PieceDataEvent.SIDE_CHANGED",
    VALUES_CHANGED = "PieceDataEvent.VALUES_CHANGED",
    ROT_CHANGED = "PieceDataEvent.ROT_CHANGED",
    ORDER_CHANGED = "PieceDataEvent.ORDER_CHANGED",
    SCORE_CHANGED = "PieceDataEvent.SCORE_CHANGED",
    PIVOT_CHANGED = "PieceDataEvent.PIVOT_CHANGED",
    JOKER_CHANGED = "PieceDataEvent.JOKER_CHANGED",
    SHOWN_CHANGED = "PieceDataEvent.SHOWN_CHANGED",
    OPEN_CHANGED = "PieceDataEvent.OPEN_CHANGED",
    POS_CHANGED = "PieceDataEvent.POS_CHANGED",
    UNUSED_IDX_CHANGED = "PieceDataEvent.UNUSED_IDX_CHANGED"
}
