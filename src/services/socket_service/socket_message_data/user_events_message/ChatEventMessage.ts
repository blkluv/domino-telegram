import {ChatMessageBody} from "./chat_event_message/ChatMessageBody";
import {CommonEventMessageData} from "./CommonEventMessageData";


export interface ChatEventMessage extends CommonEventMessageData {
    body: ChatMessageBody;
}