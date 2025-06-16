import {Spine} from "pixi-spine";
import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {LobbySpineName} from "../../../factories/spine_factory/LobbySpineName";
import {SpineFactory} from "../../../factories/SpineFactory";
import {GameEvents} from "../../../GameEvents";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class StoreButton extends Sprite {
    backgroundHeight: number = 152;
    private background: NineSlicePlane;
    private button: Button;
    private spine: Spine;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("lobby/plate_store", 52, 0, 52, 0);
        this.button = new Button({
            callback: this.onStoreButtonClick.bind(this),
            bgTextureName: "lobby/store_button",
            bgCornersSize: [148, 50, 50, 50],
            bgSizes: new Point(340, 112),
            iconTextureName: "lobby/icon_store",
            iconPosition: new Point(-90, -15),
            textKey: "Lobby/STORE",
            textPosition: new Point(65, -9),
            fontColor: 0xffffff,
            fontSize: 38,
            autoFitWidth: 150,
            disabledOffline: true,
            dimWhenDisabled: true
        });
        this.spine = SpineFactory.createLobbySpine(LobbySpineName.STORE);
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.button);
        this.addChild(this.spine);
    }

    initChildren() {
        this.button.languageText.setTextStroke(0x8150c6, 6);
        this.background.width = 380;
        this.background.height = this.backgroundHeight;
        this.spine.scale.set(.865);

        Pivot.center(this.background);

        this.button.y = 20;
        this.spine.y = 16;
        this.spine.x = 24;
        this.spine.alpha = .5;
    }

    onStoreButtonClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_STORE_POPUP));
        dispatchEvent(new MessageEvent(GameEvents.SET_SCREEN_BLUR));
    }

    destroy(): void {
        this.spine.state.timeScale = 0;

        this.removeChild(this.spine);
        this.removeChild(this.background);
        this.removeChild(this.button);

        this.spine.destroy();
        this.background.destroy();
        this.button.destroy();

        this.spine = null;
        this.background = null;
        this.button = null;

        super.destroy();
    }
}