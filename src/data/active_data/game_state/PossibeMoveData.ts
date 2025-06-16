import {DominoNumber} from "../../../domino_game/root/screens/table_screen/domino_logic/DominoNumber";
import {IPossibleMoveData} from "../../../dynamic_data/IPossibleMoveData";
import {MoveAction} from "../../../dynamic_data/MoveAction";
import {ActiveData} from '../../ActiveData';
import {ArrayWrap} from "../base/static_config_data/ArrayWrap";
import {BaseData} from '../base/static_config_data/BaseData';
import {NumberData} from "../base/static_config_data/NumberData";
import {PieceJointData} from "./piece_data/PieceJointData";


export class PossibleMoveData extends BaseData {
    joint: PieceJointData;
    piece: ArrayWrap<NumberData, DominoNumber>;

    constructor(private config: IPossibleMoveData) {
        super();

        if (!this.config) {
            return;
        }

        this.joint = new PieceJointData(this.config.joint);
        this.piece = new ArrayWrap<NumberData, DominoNumber>(NumberData, this.config?.piece || [-1, -1]);
    }

    get id(): number {
        return this.config.id;
    }

    set id(value: number) {
        this.config.id = value;
        ActiveData.addEventToPool<number>(this, PossibleMoveDataEvent.ID_CHANGED, this.config.id);
    }

    get score(): number {
        return this.config.score || 0;
    }

    set score(value: number) {
        this.config.score = value || 0;
        ActiveData.addEventToPool<number>(this, PossibleMoveDataEvent.SCORE_CHANGED, this.config.score);
    }

    get action(): MoveAction {
        return this.config.action;
    }

    set action(value: MoveAction) {
        this.config.action = value;
        ActiveData.addEventToPool<MoveAction>(this, PossibleMoveDataEvent.ACTION_CHANGED, this.config.action);
    }

    get unusedIdx(): number {
        return this.config.unusedIdx ?? -1;
    }

    set unusedIdx(value: number) {
        this.config.unusedIdx = value ?? -1;
        ActiveData.addEventToPool<number>(this, PossibleMoveDataEvent.UNUSED_IDX_CHANGED, this.config.unusedIdx);
    }
}

export enum PossibleMoveDataEvent {
    ID_CHANGED = "PossibleMoveDataEvent.ID_CHANGED",
    ACTION_CHANGED = "PossibleMoveDataEvent.ACTION_CHANGED",
    UNUSED_IDX_CHANGED = "PossibleMoveDataEvent.UNUSED_IDX_CHANGED",
    SCORE_CHANGED = "PossibleMoveDataEvent.SCORE_CHANGED",
}
