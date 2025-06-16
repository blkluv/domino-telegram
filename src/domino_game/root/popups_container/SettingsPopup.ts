import {Point} from "pixi.js";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {SettingsPopupContent} from "./settings_popup/SettingsPopupContent";


export class SettingsPopup extends BasePopup<SettingsPopupContent> {

    constructor() {
        super({contentPosition: new Point(0, -100), overlayAlpha: .2});
        this.content = new SettingsPopupContent();
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick() {
        this.content.onClose();
    }
}