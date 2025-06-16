import {PopupAnimation} from "@azur-games/pixi-vip-framework";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {StorePopupContent} from "./store_popup/StorePopupContent";


export class StorePopup extends BasePopup<StorePopupContent> {
    constructor() {
        super({clickable: false, animationType: PopupAnimation.FADE_IN});
        this.content = new StorePopupContent();
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }
}
