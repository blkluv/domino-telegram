import {PopupAnimation} from "@azur-games/pixi-vip-framework";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {InfoPopupContent} from "./info_popup/InfoPopupContent";
import {InfoPopupData} from "./info_popup/InfoPopupData";


export class InfoPopup extends BasePopup<InfoPopupContent> {
    constructor(data: InfoPopupData) {
        super({overlayAlpha: .2, animationType: PopupAnimation.FADE_IN});
        this.content = new InfoPopupContent(data);
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick(): void {
        this.content.onOverlayClick();
    }
}
