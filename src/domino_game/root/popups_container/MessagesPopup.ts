import {ProfileData} from "../../../services/socket_service/socket_message_data/ProfileData";
import {ChatEventMessage} from "../../../services/socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {MessagesPopupContent} from "./messages_popup/MessagesPopupContent";


export class MessagesPopup extends BasePopup<MessagesPopupContent> {
    constructor(messages: ChatEventMessage[], profile: ProfileData) {
        super({overlayAlpha: .2});
        this.content = new MessagesPopupContent(messages, profile);
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick() {
        this.content.onClose();
    }

}