import {CommonEventMessageData} from "./CommonEventMessageData";
import {LevelUpData} from "./level_up_event_message/LevelUpData";


export interface LevelUpEventMessage extends CommonEventMessageData {
    body: LevelUpData;
}