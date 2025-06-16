import {DynamicData} from "../DynamicData";
import {GameEvents} from "../GameEvents";
import {ChatMessagesService} from "./ChatMessagesService";
import {UserEventType} from "./socket_service/socket_message_data/user_events_message/common_event_message_data/UserEventType";
import {UserEventMessage} from "./socket_service/socket_message_data/UserEventMessage";


export class UserEventsService {
    static wantToShowLevelUp: boolean = false;

    static async handleMessage(message: UserEventMessage): Promise<void> {
        if (!message.isNew) {
            return;
        }
        switch (message.kind) {
            case UserEventType.USER:
                UserEventsService.handleChatMessage(message);
                break;
            case UserEventType.LEVEL_UP:
                if (UserEventsService.wantToShowLevelUp) {
                    UserEventsService.checkLevelUpMessage();
                    UserEventsService.wantToShowLevelUp = false;
                }
        }
    }

    static handleChatMessage(message: UserEventMessage): void {
        ChatMessagesService.updateMessagesStatus(message);
        dispatchEvent(new MessageEvent(GameEvents.ON_CHAT_MESSAGE, {data: message}));

    }

    static checkLevelUpMessage(fast: boolean = false): void {
        let message: UserEventMessage = DynamicData.userEventsMessages
            .filter(message => message.isNew)
            .find(message => message.kind === UserEventType.LEVEL_UP);
        if (!message && !fast) {
            UserEventsService.wantToShowLevelUp = true;
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.OPEN_LEVEL_UP_POPUP, {data: message}));
    }
}