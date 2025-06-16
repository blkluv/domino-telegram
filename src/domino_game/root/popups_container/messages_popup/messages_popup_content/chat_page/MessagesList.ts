import {Point} from "pixi.js";
import {ScrollContainer} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../DynamicData";
import {GameEvents} from "../../../../../../GameEvents";
import {ChatMessagesService} from "../../../../../../services/ChatMessagesService";
import {ChatEventMessage} from "../../../../../../services/socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {UserOnlineStatus} from "../../../../../../services/socket_service/UserOnlineStatus";
import {SocketService} from "../../../../../../services/SocketService";
import {SoundsPlayer} from "../../../../../../services/SoundsPlayer";
import {EmptyListPlaceholder} from "../chats_list_page/EmptyListPlaceholder";
import {Message} from "./messages_list/Message";


export class MessagesList extends ScrollContainer<Message> {
    private noMessagesPlaceholder: EmptyListPlaceholder;
    private initialTopOffset: number = 100;
    private marginBetweenMessages: number = 20;
    private messagesHeight: number = 0;
    private onChatMessageBindThis: (e: MessageEvent) => void;
    private userID: number;
    chatOpen: boolean;

    constructor() {
        super({
            maskSizes: new Point(1500, 505),
            maskPosition: new Point(0, 255),
            scrollBarTexture: "messages/scrollbar_bg",
            scrollEventName: GameEvents.MESSAGES_LIST_SCROLL,
            bottomMargin: -80
        });

        this.onChatMessageBindThis = this.onChatMessage.bind(this);
        addEventListener(GameEvents.ON_CHAT_MESSAGE, this.onChatMessageBindThis);

        this.noMessagesPlaceholder = new EmptyListPlaceholder("messages/art_messages", "ChatWindow/conversion/empty");
        this.addChild(this.noMessagesPlaceholder);
        this.noMessagesPlaceholder.y = 240;
        this.scrollBar.x = 633;
    }

    create(messages: ChatEventMessage[], userId: number): void {
        this.userID = userId;
        this.clear();
        this.messagesHeight = this.initialTopOffset;
        this.noMessagesPlaceholder.visible = !messages.length;
        messages.forEach(messageData => this.addMessage(messageData));
        this.list.scrollable ? this.scrollToBottom(false) : this.scrollToTop(false);
    }

    addMessage(messageData: ChatEventMessage): void {
        (messageData.isNew && messageData.senderId != DynamicData.myProfile.id) && SocketService.viewMessage([messageData.id]);
        this.noMessagesPlaceholder.visible = false;

        let message: Message = new Message(messageData.senderId == DynamicData.myProfile.id ? DynamicData.myProfile : messageData.sender, messageData.body.text);
        let messageY: number = this.messagesHeight;
        this.messagesHeight = messageY + this.marginBetweenMessages + message.totalHeight;

        this.addToList(message, messageY + message.yOffset, this.messagesHeight);
    }

    onChatMessage(e: MessageEvent): void {
        let message: ChatEventMessage = e.data;
        let myMessage: boolean = message.senderId == DynamicData.myProfile.id;
        if (!myMessage && message.senderId != this.userID) {
            return;
        }
        if (!myMessage && this.chatOpen) {
            SoundsPlayer.play("message");
            ChatMessagesService.readAllMessagesByUser(message.senderId);
        }
        this.addMessage(message);
        this.scrollToBottom();
    }

    updateOnlineStatus(onlineStatus: UserOnlineStatus): void {
        this.list.items.forEach(message => message.updateOnlineStatus(onlineStatus));
    }

    destroy(): void {
        removeEventListener(GameEvents.ON_CHAT_MESSAGE, this.onChatMessageBindThis);
        this.onChatMessageBindThis = null;

        this.removeChild(this.noMessagesPlaceholder);
        this.noMessagesPlaceholder.destroy();
        this.noMessagesPlaceholder = null;

        super.destroy();
    }
}