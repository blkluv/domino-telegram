import {CommonEventMessageData} from "./CommonEventMessageData";
import {InviteData} from "./invite_event_message/InviteData";


export interface InviteEventMessage extends CommonEventMessageData {
    body: InviteData;
}