import {BasePopup} from "@azur-games/pixi-vip-framework";
import {InputPopupContent} from "./input_popup/InputPopupContent";
import {InputPopupData} from "./input_popup/InputPopupData";


export class InputPopup extends BasePopup<InputPopupContent> {
    constructor(data: InputPopupData) {
        super({overlayAlpha: .2, clickable: true});
        this.content = new InputPopupContent(data);
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick(): void {
        this.content.onOverlayClick();
    }
}
