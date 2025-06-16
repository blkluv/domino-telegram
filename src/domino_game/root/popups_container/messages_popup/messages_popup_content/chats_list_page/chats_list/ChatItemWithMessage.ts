import {LanguageText} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../../GameEvents";
import {ChatMessagesService} from "../../../../../../../services/ChatMessagesService";
import {PreloaderService} from "@azur-games/pixi-vip-framework";
import {ProfileData} from "../../../../../../../services/socket_service/socket_message_data/ProfileData";
import {ChatEventMessage} from "../../../../../../../services/socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {SocketService} from "../../../../../../../services/SocketService";
import {StringUtils} from "@azur-games/pixi-vip-framework";
import {ChatsListItem} from "./ChatsListItem";
import {NotificationBadge} from "./chat_item_with_message/NotificationBadge";


export class ChatItemWithMessage extends ChatsListItem {
    private lastMessageText: LanguageText;
    private newMessageNotification: NotificationBadge;
    private onMessagesUpdateBindThis: (e: MessageEvent) => void;

    constructor(profileData: ProfileData, private lastMessage: string, private unreadCount: number) {
        super(profileData);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.updateMessageStatus();

        this.onMessagesUpdateBindThis = this.onMessagesUpdate.bind(this);
        addEventListener(GameEvents.USER_MESSAGES_STATUSES_CHANGED, this.onMessagesUpdateBindThis);
    }

    onMessagesUpdate() {
        this.lastMessage = ChatMessagesService.getLastMessage(this.profileData.id).body.text;
        this.unreadCount = ChatMessagesService.getMessagesStatus(this.profileData.id).unreadCount;
        this.updateMessageStatus();
    }

    updateMessageStatus(): void {
        this.background.changeBackgroundImage("friends/item_bg_" + (this.unreadCount ? "light" : "dark"));
        this.lastMessageText.changeText(StringUtils.cutMessagePreview(this.lastMessage), false);
        this.newMessageNotification.changeValue(this.unreadCount.toString());
        this.newMessageNotification.visible = !!this.unreadCount;
        this.lastVisitText.style.fill = !!this.unreadCount ? 0x6661A5 : 0xADA7FF;
        this.lastMessageText.style.fill = !!this.unreadCount ? 0x45408A : 0xADA7FF;
    }

    createChildren(): void {
        this.nameText = new LanguageText({key: this.profileData.name, fontSize: 33, autoFitWidth: 260});
        this.lastMessageText = new LanguageText({key: "", fontSize: 23, fill: 0xADA7FF});
        this.lastVisitText = new LanguageText({key: "FriendRecord.last-visit", fontSize: 19, fontWeight: "400", fill: 0xADA7FF, placeholders: [StringUtils.formatDate(new Date(this.profileData.lastVisit))]});
        this.newMessageNotification = new NotificationBadge(this.unreadCount.toString());
    }

    addChildren(): void {
        this.addChild(this.nameText);
        this.addChild(this.lastMessageText);
        this.addChild(this.lastVisitText).visible = !this.profileData.online;
        this.addChild(this.newMessageNotification);
    }

    initChildren(): void {
        this.nameText.setTextStroke(0x4E48A1, 4, false);
        this.lastVisitText.anchor.set(1, 0);

        this.nameText.x = -470;
        this.nameText.y = -42;
        this.lastMessageText.x = -470;
        this.lastMessageText.y = 6;
        this.lastVisitText.x = 550;
        this.lastVisitText.y = -30;
        this.newMessageNotification.x = 610;
        this.newMessageNotification.y = -35;
    }

    async processClick(): Promise<void> {
        if (this.dragged) {
            return;
        }
        let preloaderId: number = PreloaderService.show();
        let messages: ChatEventMessage[] = await SocketService.getUserMessages(this.profileData.id);
        PreloaderService.hide(preloaderId);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_CHAT, {data: {messages, profile: this.profileData}}));
    }

    destroy(): void {
        removeEventListener(GameEvents.USER_MESSAGES_STATUSES_CHANGED, this.onMessagesUpdateBindThis);
        this.onMessagesUpdateBindThis = null;

        this.removeChild(this.lastMessageText);
        this.removeChild(this.newMessageNotification);

        this.lastMessageText.destroy();
        this.newMessageNotification.destroy();

        this.lastMessageText = null;
        this.newMessageNotification = null;

        super.destroy();
    }
}
