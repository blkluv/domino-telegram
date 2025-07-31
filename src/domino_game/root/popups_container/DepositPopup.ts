import {PopupAnimation} from "@azur-games/pixi-vip-framework";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../GameEvents";
import {DepositPopupContent} from "./deposit_popup/DepositPopupContent";


export class DepositPopup extends BasePopup<DepositPopupContent> {
    constructor() {
        super({clickable: true, animationType: PopupAnimation.FADE_IN});
        this.content = new DepositPopupContent();
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    public onOverlayClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_DEPOSIT_POPUP));
    }
}