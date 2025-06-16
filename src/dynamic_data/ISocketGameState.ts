import {GamePhase} from "./GamePhase";
import {IPieceData} from "./IPieceData";
import {IPieceJointData} from "./IPieceJointData";
import {IPossibleMoveData} from "./IPossibleMoveData";
import {IRoundUser} from "./IRoundUser";
import {SitPlace} from "./SitPlace";


export type ISocketGameState = {
    playersSlots: IPlayersSlotsData;
    exitPlayer: SitPlace,
    pieces: IPieceData[],
    phase: GamePhase,
    turn: SitPlace,
    possibleMoves: IPossibleMoveData[],
    targetScore: number,
    syncDelayMillis: number,
    timerEndDelayMillis: number,
    timerDurationMillis: number,
    playersArray: IRoundUser[],
    joints: IPieceJointData[],
    round: number
    takingUnused: boolean
}
export type IPlayersSlotsData = {top: IRoundUser, left: IRoundUser, right: IRoundUser, bottom: IRoundUser}