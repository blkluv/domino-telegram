import {BasePopup} from "@azur-games/pixi-vip-framework";
import {FriendsPopupContent} from "./friends_popup/FriendsPopupContent";


export class FriendsPopup extends BasePopup<FriendsPopupContent> {

    constructor() {
        super({overlayAlpha: .2});
        this.content = new FriendsPopupContent();
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick() {
        this.content.onClose();
    }
}