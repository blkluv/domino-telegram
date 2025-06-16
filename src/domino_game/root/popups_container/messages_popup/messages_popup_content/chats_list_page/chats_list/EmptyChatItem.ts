import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../../GameEvents";
import {ProfileData} from "../../../../../../../services/socket_service/socket_message_data/ProfileData";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {StringUtils} from "@azur-games/pixi-vip-framework";


;
import {ChatsListItem} from "./ChatsListItem";


export class EmptyChatItem extends ChatsListItem {
    private messageButton: Button;

    constructor(profileData: ProfileData) {
        super(profileData);
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.nameText = new LanguageText({key: this.profileData.name, fontSize: 33, autoFitWidth: 260});
        this.lastVisitText = new LanguageText({key: "FriendRecord.last-visit", fontSize: 19, fontWeight: "400", fill: 0xADA7FF, placeholders: [StringUtils.formatDate(new Date(this.profileData.lastVisit))]});
        this.messageButton = new Button({callback: this.onMessageClick.bind(this), bgTextureName: "friends/bg_blue_shadow", iconTextureName: "friends/icon_message"});
    }

    addChildren(): void {
        this.addChild(this.nameText);
        this.addChild(this.lastVisitText).visible = !this.profileData.online;
        this.addChild(this.messageButton);
    }

    initChildren(): void {
        this.nameText.setTextStroke(0x4D4799, 4, false);
        Pivot.center(this.nameText, false);
        Pivot.center(this.lastVisitText, false);

        this.profileData.online || (this.nameText.y = -17);
        this.lastVisitText.y = 20;
        this.nameText.x = this.lastVisitText.x = -470;
        this.messageButton.x = 550;
    }

    processClick(): void {
        this.openChat();
    }

    onMessageClick(): void {
        this.openChat();
    }

    openChat(): void {
        if (this.dragged) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.OPEN_CHAT, {data: {messages: [], profile: this.profileData}}));
    }

    destroy(): void {
        this.removeChild(this.messageButton);
        this.messageButton.destroy();
        this.messageButton = null;

        super.destroy();
    }
}
