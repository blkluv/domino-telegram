import {BasePopup, PopupAnimation} from "@azur-games/pixi-vip-framework";
import {MaintenancePopupContent} from "./maintenance_popup/MaintenancePopupContent";


export class MaintenancePopup extends BasePopup<MaintenancePopupContent> {
    constructor() {
        super({clickable: false, animationType: PopupAnimation.FADE_IN});
        this.content = new MaintenancePopupContent();
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }
}