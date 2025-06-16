import {BasePopup} from "@azur-games/pixi-vip-framework";
import {LeaveGamePopupContent} from "./leave_game_popup/LeaveGamePopupContent";


export class LeaveGamePopup extends BasePopup<LeaveGamePopupContent> {
    constructor() {
        super();
        this.content = new LeaveGamePopupContent();
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick(): void {
        this.content.onClose();
    }
}
