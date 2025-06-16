import {BasePopup, PopupAnimation} from "@azur-games/pixi-vip-framework";
import {DominoGame} from "../../app";
import {Rotator} from "./preloader/Rotator";


export class Preloader extends BasePopup<Rotator> {
    private showTimeoutId: number;

    constructor() {
        super({clickable: false, animationType: PopupAnimation.FADE_IN});
        this.content = new Rotator();
        this.addChild(this.content);
        this.initChildren();
        this.closeOverlay.interactiveChildren = this.closeOverlay.interactive = false;
    }

    showPreloader() {
        this.showTimeoutId = window.setTimeout(this.show.bind(this, true), 500);
    }

    hidePreloader() {
        clearTimeout(this.showTimeoutId);
        this.show(false);
    }

    async show(value: boolean): Promise<void> {
        DominoGame.instance.root.interactive = DominoGame.instance.root.interactiveChildren = !value;
        value ? this.content.start() : this.content.stop();
        await super.show(value, false);
    }
}
