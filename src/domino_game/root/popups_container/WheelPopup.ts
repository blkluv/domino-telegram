import {PopupAnimation} from "@azur-games/pixi-vip-framework";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {WheelPopupContent} from "./wheel_popup/WheelPopupContent";


export class WheelPopup extends BasePopup<WheelPopupContent> {
    constructor() {
        super({clickable: false, animationType: PopupAnimation.FADE_IN});
        this.content = new WheelPopupContent();
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    async show(value: boolean): Promise<void> {
        super.show(value);
    }

    onGameScaleChanged(): void {
        this.content?.onGameScaleChanged();
        super.onGameScaleChanged();
    }
}