import {PopupAnimation} from "@azur-games/pixi-vip-framework";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {EditProfilePopupContent} from "./edit_profile_popup/EditProfilePopupContent";


export class EditProfilePopup extends BasePopup<EditProfilePopupContent> {

    constructor() {
        super({clickable: false, animationType: PopupAnimation.FADE_IN});
        this.content = new EditProfilePopupContent();
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onGameScaleChanged(): void {
        super.onGameScaleChanged();
        this.content?.onGameScaleChanged();
    }
}