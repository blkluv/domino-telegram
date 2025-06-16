import {Point} from "pixi.js";
import {BasePopup} from "@azur-games/pixi-vip-framework";
import {TutorialPopupContent} from "./tutorial_popup/TutorialPopupContent";


export class TutorialPopup extends BasePopup<TutorialPopupContent> {
    constructor() {
        super({overlayAlpha: .7, contentPosition: new Point(0, 50)});
        this.content = new TutorialPopupContent();
        this.addChild(this.content);
        this.initChildren();
        this.show(true);
    }

    onOverlayClick() {
        this.content.onClose();
    }
}