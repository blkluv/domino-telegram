import {DominoNumber} from "../domino_game/root/screens/table_screen/domino_logic/DominoNumber";
import {PieceRot} from "./IPieceData";


export type IPieceJointData = {
    piece: [DominoNumber, DominoNumber],
    additional: boolean,
    value: DominoNumber,
    joinValue: DominoNumber,
    dir: PieceRot
}