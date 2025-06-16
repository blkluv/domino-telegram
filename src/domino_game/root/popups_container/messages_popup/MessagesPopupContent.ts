import {Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {ProfileData} from "../../../../services/socket_service/socket_message_data/ProfileData";
import {ChatEventMessage} from "../../../../services/socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {UserOnlineStatus} from "../../../../services/socket_service/UserOnlineStatus";
import {SocketService} from "../../../../services/SocketService";
import {BigPopupBody} from "../friends_popup/friends_popup_content/BigPopupBody";
import {ChatPage} from "./messages_popup_content/ChatPage";
import {ChatsListPage} from "./messages_popup_content/ChatsListPage";


export class MessagesPopupContent extends Sprite {
    private body: BigPopupBody;
    private allChats: ChatsListPage;
    private chat: ChatPage;
    private onOpenChatBindThis: (e: MessageEvent) => void;
    private onChatInputBindThis: (e: MessageEvent) => void;
    private backButton: Button;
    private updateOnlineStatusInterval: number;
    private chatOpen: boolean;

    constructor(messages: ChatEventMessage[], profile: ProfileData) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.onOpenChatBindThis = this.onOpenChat.bind(this);
        this.onChatInputBindThis = this.onChatInput.bind(this);
        addEventListener(GameEvents.OPEN_CHAT, this.onOpenChatBindThis);
        addEventListener(GameEvents.ON_CHAT_INPUT, this.onChatInputBindThis);

        this.openChat(messages, profile);

        this.updateOnlineStatusInterval = window.setInterval(this.updateOnlineStatus.bind(this), 10000);
        this.updateOnlineStatus();
    }

    createChildren(): void {
        this.body = new BigPopupBody(this.onClose.bind(this), "ChatWindow/title");
        this.allChats = new ChatsListPage();
        this.chat = new ChatPage();
        this.backButton = new Button({callback: this.closeChat.bind(this), bgTextureName: "common/back_button"});
    }

    addChildren(): void {
        this.addChild(this.body);
        this.addChild(this.allChats);
        this.addChild(this.chat).visible = false;
        this.addChild(this.backButton).visible = false;
    }

    initChildren(): void {
        this.backButton.y = -355;
        this.backButton.x = -590;
    }

    onClose(): void {
        if (this.allChats.chatsList.dragged || this.chat.messagesList.dragged) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_MESSAGES_POPUP));
    }

    async updateOnlineStatus(): Promise<void> {
        if (!this.chatOpen) {
            this.allChats.updateOnlineStatus();
            return;
        }
        let onlineStatus: UserOnlineStatus = await SocketService.getOnlineStatus(this.chat.profile.id);
        this.body.changeTitle(onlineStatus.name);
        this.chat.updateOnlineStatus(onlineStatus);
    }

    onOpenChat(e: MessageEvent): void {
        let messages: ChatEventMessage[] = e.data.messages;
        let profile: ProfileData = e.data.profile;
        this.openChat(messages, profile);
    }

    openChat(messages: ChatEventMessage[], profile: ProfileData): void {
        if (!messages || !profile) {
            return;
        }
        this.allChats.visible = false;
        this.chat.visible = true;
        this.backButton.visible = true;
        this.chat.create(messages, profile);
        this.body.changeTitle(profile.name);
        this.chatOpen = true;
        this.chat.messagesList.chatOpen = true;
        this.updateOnlineStatus();
    }

    async closeChat(): Promise<void> {
        this.chat.clear();
        this.chat.visible = false;
        this.allChats.visible = true;
        this.backButton.visible = false;
        this.body.changeTitle("ChatWindow/title");
        this.body.background.height = 720;
        this.allChats.clearInput();
        this.chatOpen = false;
        this.chat.messagesList.chatOpen = false;
        await this.allChats.initList();
        this.updateOnlineStatus();
    }

    onChatInput(e: MessageEvent): void {
        let inputBackgroundHeight: number = e.data;
        this.body.background.height = this.body.defaultBackgroundSize.y + inputBackgroundHeight - 81;
    }

    destroy(): void {
        removeEventListener(GameEvents.OPEN_CHAT, this.onOpenChatBindThis);
        removeEventListener(GameEvents.ON_CHAT_INPUT, this.onChatInputBindThis);
        this.onOpenChatBindThis = null;
        this.onChatInputBindThis = null;

        window.clearInterval(this.updateOnlineStatusInterval);

        this.removeChild(this.body);
        this.removeChild(this.allChats);
        this.removeChild(this.chat);
        this.removeChild(this.backButton);

        this.body.destroy();
        this.allChats.destroy();
        this.chat.destroy();
        this.backButton.destroy();

        this.body = null;
        this.allChats = null;
        this.chat = null;
        this.backButton = null;

        super.destroy();
    }
}
