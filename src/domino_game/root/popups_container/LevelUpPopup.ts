import {GameEvents} from "../../../GameEvents";
import {LevelUpEventMessage} from "../../../services/socket_service/socket_message_data/user_events_message/LevelUpEventMessage";
import {PopupAnimation} from "@azur-games/pixi-vip-framework";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {LevelUpPopupContent} from "./level_up_popup/LevelUpPopupContent";


export class LevelUpPopup extends BasePopup<LevelUpPopupContent> {
    constructor(eventMessageData: LevelUpEventMessage) {
        super({clickable: false, overlayAlpha: .5, animationType: PopupAnimation.FADE_IN});
        this.content = new LevelUpPopupContent(eventMessageData);
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick() {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_LEVEL_UP_POPUP));
    }
}
