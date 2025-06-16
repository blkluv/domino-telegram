import {DominoNumber} from "../domino_game/root/screens/table_screen/domino_logic/DominoNumber";
import {PlayerData} from "../services/socket_service/socket_message_data/profile_data/PlayerData";
import {SitPlace} from "./SitPlace";


export interface IRoundUser extends PlayerData {
    roundsWon: number;
    fake?: boolean,
    alive?: boolean,
    side: SitPlace,
    tableId: number,
    afk: boolean,
    moveScore: number,
    winScore: number,
    coins: number,
    score: number,
    absentVals: DominoNumber[],
    state: UserState
}

export enum UserState {
    STARTED = "started",
    LEAVING = "leaving",
    SPECTATING = "spectating",
    NONE = "",
}