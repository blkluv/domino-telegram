import {DominoNumber} from "../domino_game/root/screens/table_screen/domino_logic/DominoNumber";
import {PlayerData} from "../services/socket_service/socket_message_data/profile_data/PlayerData";
import {SitPlace} from "./SitPlace";


export interface RoundUser extends PlayerData {
    fake?: boolean,
    alive?: boolean,
    sitPlace?: SitPlace,
    tableId: number,
    side: SitPlace,
    afk: boolean,
    moveScore: number,
    winScore: number,
    coins: number,
    score: number,
    absentVals: DominoNumber[]
}