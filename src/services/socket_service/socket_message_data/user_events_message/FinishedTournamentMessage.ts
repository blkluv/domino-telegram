import {CommonEventMessageData} from "./CommonEventMessageData";
import {FinishedTournamentData} from "./finished_tournament_message/FinishedTournamentData";


export interface FinishedTournamentMessage extends CommonEventMessageData {
    body: FinishedTournamentData;
}