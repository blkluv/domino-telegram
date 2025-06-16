import {ProfileData} from "../../../services/socket_service/socket_message_data/ProfileData";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {ProfilePopupContent} from "./profile_popup/ProfilePopupContent";


export class ProfilePopup extends BasePopup<ProfilePopupContent> {

    constructor(profileData: ProfileData, overlayAlpha: number = .2) {
        super({overlayAlpha});
        this.content = new ProfilePopupContent(profileData);
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick() {
        this.content.onClose();
    }
}