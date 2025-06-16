import {DominoGame} from "../../../../app";
import {Button} from "@azur-games/pixi-vip-framework";
import {ClaimCoins} from "../../../../common/ClaimCoins";
import {StageResizeListening} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {StoreBackground} from "./store_popup_content/StoreBackground";
import {StoreContainer} from "./store_popup_content/StoreContainer";


export class StorePopupContent extends StageResizeListening {
    private background: StoreBackground;
    private storeContainer: StoreContainer;
    private closeButton: Button;
    private claimCoins: ClaimCoins;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.onGameScaleChanged();
    }

    createChildren(): void {
        this.background = new StoreBackground();
        this.storeContainer = new StoreContainer();
        this.closeButton = new Button({callback: this.onClose.bind(this), bgTextureName: "common/button_close"});
        this.claimCoins = new ClaimCoins();

    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.storeContainer);
        this.addChild(this.closeButton);
        this.addChild(this.claimCoins);
    }

    onClose(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_STORE_POPUP));
        dispatchEvent(new MessageEvent(GameEvents.CLEAR_SCREEN_BLUR));
    }

    onGameScaleChanged(): void {
        this.closeButton.x = DominoGame.instance.screenW / 2 - 100;
        this.closeButton.y = -DominoGame.instance.screenH / 2 + 100;
        this.storeContainer.y = (DominoGame.instance.screenH / 2 - this.storeContainer.background.height / 2);
        this.background.onGameScaleChanged();
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.storeContainer);
        this.removeChild(this.closeButton);
        this.removeChild(this.claimCoins);

        this.background.destroy();
        this.storeContainer.destroy();
        this.closeButton.destroy();
        this.claimCoins.destroy();

        this.background = null;
        this.storeContainer = null;
        this.closeButton = null;
        this.claimCoins = null;

        super.destroy();
    }
}
