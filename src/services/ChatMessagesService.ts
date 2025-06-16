import {DynamicData} from "../DynamicData";
import {GameEvents} from "../GameEvents";
import {UserMessagesStatusByIdMap} from "./chat_message_service/UserMessagesStatusByIdMap";
import {ChatEventMessage} from "./socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {UserEventType} from "./socket_service/socket_message_data/user_events_message/common_event_message_data/UserEventType";
import {UserMessageStatus} from "./socket_service/socket_message_data/user_messages_status_by_id/UserMessageStatus";
import {UserEventMessage} from "./socket_service/socket_message_data/UserEventMessage";
import {UserMessagesStatusById} from "./socket_service/socket_message_data/UserMessagesStatusById";


export class ChatMessagesService {
    static openedChatProfileId: number;
    static userMessagesStatusByIdMap: UserMessagesStatusByIdMap = new Map<number, UserMessageStatus>();

    static setStatuses(statuses: UserMessagesStatusById): void {
        let keys: string[] = Object.keys(statuses);
        let values: UserMessageStatus[] = Object.values(statuses);

        keys.forEach((key: string, index: number): void => {
            this.userMessagesStatusByIdMap.set(parseInt(key), values[index]);
        });
    }

    static getMessagesStatus(profileId: number): UserMessageStatus {
        return this.userMessagesStatusByIdMap.get(profileId);
    }

    static getLastMessage(profileId: number): ChatEventMessage | undefined {
        return DynamicData.userEventsMessages
            .filter(message => message.kind == UserEventType.USER && profileId == (message.profile?.id || message.sender?.id))
            .sort((a, b) => b.id - a.id)
            [0] as ChatEventMessage;
    }

    static readAllMessagesByUser(profileId: number): void {
        let messagesStatus: UserMessageStatus = this.userMessagesStatusByIdMap.get(profileId);
        if (!messagesStatus) {
            return;
        }
        messagesStatus.unreadCount = 0;
        this.userMessagesStatusByIdMap.set(profileId, messagesStatus);
        dispatchEvent(new MessageEvent(GameEvents.USER_MESSAGES_STATUSES_CHANGED));
    }

    static getAllUnreadMessagesCount(): number {
        let unreadCount = 0;
        for (let messagesStatus of this.userMessagesStatusByIdMap.values()) {
            unreadCount += messagesStatus.unreadCount;
        }
        return unreadCount;
    }

    static getChatPartnerIdFromMessage(message: ChatEventMessage): number {
        let myMessage: boolean = message.senderId == DynamicData.myProfile.id;
        return myMessage ? message.profileId : message.senderId;
    }

    static updateMessagesStatus(message: UserEventMessage): void {
        let myMessage: boolean = message.senderId == DynamicData.myProfile.id;
        let chatPartnerId: number = this.getChatPartnerIdFromMessage(message as ChatEventMessage);
        let messagesStatus: UserMessageStatus = this.userMessagesStatusByIdMap.get(chatPartnerId) || {sentCount: 0, receivedCount: 0, unreadCount: 0};

        if (myMessage) {
            messagesStatus.sentCount++;
        } else {
            messagesStatus.receivedCount++;
            ChatMessagesService.openedChatProfileId == chatPartnerId || messagesStatus.unreadCount++;

        }
        this.userMessagesStatusByIdMap.set(chatPartnerId, messagesStatus);
        dispatchEvent(new MessageEvent(GameEvents.USER_MESSAGES_STATUSES_CHANGED));

        if (ChatMessagesService.openedChatProfileId == chatPartnerId || myMessage) {
            return;
        }

        // let data: NotificationData = {
        //     senderProfile: message.sender,
        //     notificationStaticText: StringUtils.cutMessagePreview(message.body.text),
        //     message,
        //     resolve: null
        // };
        // dispatchEvent(new MessageEvent(GameEvents.NOTIFICATION_SHOW, {data}));
    }
}