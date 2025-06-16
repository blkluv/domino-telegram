import {DominoNumber} from "../../../../domino_game/root/screens/table_screen/domino_logic/DominoNumber";
import {PieceRot} from "../../../../dynamic_data/IPieceData";
import {IPieceJointData} from "../../../../dynamic_data/IPieceJointData";
import {ActiveData} from "../../../ActiveData";
import {ArrayWrap} from "../../base/static_config_data/ArrayWrap";
import {BaseData} from "../../base/static_config_data/BaseData";
import {NumberData} from "../../base/static_config_data/NumberData";


export class PieceJointData extends BaseData {
    piece: ArrayWrap<NumberData, number>;

    constructor(public config: IPieceJointData) {
        super();

        if (!this.config) {
            return;
        }
        this.piece = new ArrayWrap<NumberData, number>(NumberData, this.config.piece);
    }

    get additional(): boolean {
        return this.config.additional || false;
    }

    set additional(value: boolean) {
        this.config.additional = value || false;
        ActiveData.addEventToPool<boolean>(this, PieceJointDataEvent.ADDITIONAL_CHANGED, this.config.additional);
    }

    get value(): DominoNumber {
        return this.config.value == null ? -1 : this.config.value;
    }

    set value(value: DominoNumber) {
        this.config.value = value == null ? -1 : value;
        ActiveData.addEventToPool<DominoNumber>(this, PieceJointDataEvent.VALUE_CHANGED, this.config.value);
    }

    get joinValue(): DominoNumber {
        return this.config.value == null ? -1 : this.config.value;
    }

    set joinValue(value: DominoNumber) {
        this.config.joinValue = value == null ? -1 : value;
        ActiveData.addEventToPool<DominoNumber>(this, PieceJointDataEvent.JOIN_VALUE_CHANGED, this.config.joinValue);
    }

    get dir(): PieceRot {
        return this.config.dir || PieceRot.NONE;
    }

    set dir(value: PieceRot) {
        this.config.dir = value || PieceRot.NONE;
        ActiveData.addEventToPool<PieceRot>(this, PieceJointDataEvent.DIR_CHANGED, this.config.dir);
    }
}

export enum PieceJointDataEvent {
    ADDITIONAL_CHANGED = "PieceJointDataEvent.SIDE_CHANGED",
    VALUE_CHANGED = "PieceJointDataEvent.VALUE_CHANGED",
    JOIN_VALUE_CHANGED = "PieceJointDataEvent.JOIN_VALUE_CHANGED",
    DIR_CHANGED = "PieceJointDataEvent.DIR_CHANGED",
    PIECE_CHANGED = "PieceJointDataEvent.PIECE_CHANGED"
}
