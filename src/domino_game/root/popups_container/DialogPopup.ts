import {BasePopup} from "@azur-games/pixi-vip-framework";
import {DialogPopupContent} from "./dialog_popup/DialogPopupContent";
import {DialogPopupData} from "./dialog_popup/DialogPopupData";


export class DialogPopup extends BasePopup<DialogPopupContent> {
    constructor(data: DialogPopupData) {
        super({overlayAlpha: .2, clickable: data.closable});
        this.content = new DialogPopupContent(data);
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick(): void {
        this.content.onOverlayClick();
    }
}
