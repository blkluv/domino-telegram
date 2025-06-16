import {FinishedTournamentMessage} from "./user_events_message/FinishedTournamentMessage";
import {InviteEventMessage} from "./user_events_message/InviteEventMessage";
import {ChatEventMessage} from "./user_events_message/ChatEventMessage";
import {LevelUpEventMessage} from "./user_events_message/LevelUpEventMessage";


export type UserEventMessage = ChatEventMessage | InviteEventMessage | LevelUpEventMessage | FinishedTournamentMessage