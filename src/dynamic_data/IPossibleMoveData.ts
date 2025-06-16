import {DominoNumber} from "../domino_game/root/screens/table_screen/domino_logic/DominoNumber";
import {IPieceJointData} from "./IPieceJointData";
import {MoveAction} from "./MoveAction";


export type IPossibleMoveData = {
    id: number;
    action: MoveAction;
    joint: IPieceJointData;
    piece: [DominoNumber, DominoNumber];
    unusedIdx: number,
    score: number
}