import {NineSlicePlane, Point} from "pixi.js";
import {ScrollContainer} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {ChatMessagesService} from "../../../../../../services/ChatMessagesService";
import {ProfileData} from "../../../../../../services/socket_service/socket_message_data/ProfileData";
import {ChatEventMessage} from "../../../../../../services/socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {UserMessageStatus} from "../../../../../../services/socket_service/socket_message_data/user_messages_status_by_id/UserMessageStatus";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {ChatItemWithMessage} from "./chats_list/ChatItemWithMessage";
import {ChatsListItem} from "./chats_list/ChatsListItem";
import {EmptyChatItem} from "./chats_list/EmptyChatItem";


export class ChatsList extends ScrollContainer<ChatsListItem> {
    private bottomGradient: NineSlicePlane;

    constructor() {
        super({
            maskSizes: new Point(1320, 536),
            maskPosition: new Point(0, 234),
            marginBetweenItems: 130,
            bottomMargin: 100,
            scrollBarTexture: "messages/scrollbar_bg",
        });
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.bottomGradient = DisplayObjectFactory.createNineSlicePlane("messages/bottom_gradient", 8, 8, 8, 8);
    }

    addChildren(): void {
        this.addChild(this.bottomGradient);
    }

    initChildren(): void {
        this.bottomGradient.width = 1310;
        this.bottomGradient.height = 100;

        Pivot.center(this.bottomGradient);

        this.bottomGradient.y = 455;
        this.scrollBar.x = 632;
    }

    updateList(profiles: ProfileData[]): void {
        let chats: ChatsListItem[] = profiles.map(profile => {
            let lastMessage: ChatEventMessage = ChatMessagesService.getLastMessage(profile.id);
            let messagesStatus: UserMessageStatus = ChatMessagesService.getMessagesStatus(profile.id);
            return lastMessage ? new ChatItemWithMessage(profile, lastMessage.body.text, messagesStatus.unreadCount) : new EmptyChatItem(profile);
        });
        this.createList(chats, 55);
    }

    updateOnlineStatus(): void {
        this.list.items.forEach(chat => chat.updateOnlineStatus());
    }

    destroy(): void {
        this.removeChild(this.bottomGradient);
        this.bottomGradient.destroy();
        this.bottomGradient = null;

        super.destroy();
    }

}
