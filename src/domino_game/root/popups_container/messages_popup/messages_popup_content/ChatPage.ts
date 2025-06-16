import {NineSlicePlane, Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {ChatMessagesService} from "../../../../../services/ChatMessagesService";
import {ProfileData} from "../../../../../services/socket_service/socket_message_data/ProfileData";
import {ChatEventMessage} from "../../../../../services/socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {UserOnlineStatus} from "../../../../../services/socket_service/UserOnlineStatus";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {MessageInput} from "./chat_page/MessageInput";
import {MessagesList} from "./chat_page/MessagesList";


export class ChatPage extends Sprite {
    private background: NineSlicePlane;
    private input: MessageInput;
    messagesList: MessagesList;
    profile: ProfileData;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("friends/page_bg", 30, 30, 30, 30);
        this.input = new MessageInput();
        this.messagesList = new MessagesList();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.input);
        this.addChild(this.messagesList);
    }

    initChildren(): void {
        this.background.width = 1354;
        this.background.height = 534;

        Pivot.center(this.background);
        this.background.y = -45;
        this.input.y = 270;
        this.messagesList.y = -300;
    }

    create(messages: ChatEventMessage[], profile: ProfileData): void {
        this.profile = profile;
        this.messagesList.create(messages, profile.id);
        this.input.setUserID(profile.id);
        ChatMessagesService.readAllMessagesByUser(profile.id);
    }

    clear(): void {
        this.messagesList.clear();
        this.input.clearInput();
    }

    updateOnlineStatus(onlineStatus: UserOnlineStatus): void {
        this.messagesList.updateOnlineStatus(onlineStatus);
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.input);
        this.removeChild(this.messagesList);

        this.background.destroy();
        this.input.destroy();
        this.messagesList.destroy();

        this.background = null;
        this.input = null;
        this.messagesList = null;

        super.destroy();
    }
}
