import {ProfileData} from "../ProfileData";
import {UserEventType} from "./common_event_message_data/UserEventType";


export interface CommonEventMessageData {
    id: number;
    kind: UserEventType;
    createdAt: string;
    isNew: boolean;
    profileId: number;
    sender?: ProfileData;
    profile?: ProfileData;
    senderId: number;
    updatedAt: number;
}