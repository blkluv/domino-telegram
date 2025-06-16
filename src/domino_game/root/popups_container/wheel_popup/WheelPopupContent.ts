import {filters, Sprite} from "pixi.js";
import {DominoGame} from "../../../../app";
import {ClaimCoins} from "../../../../common/ClaimCoins";
import {GameEvents} from "../../../../GameEvents";
import {WheelSector} from "../../../../services/socket_service/socket_message_data/wheel_config/WheelSector";
import {SocketService} from "../../../../services/SocketService";
import {SoundsPlayer} from "../../../../services/SoundsPlayer";
import {Timeout} from "@azur-games/pixi-vip-framework";
import {RewardContainer} from "./wheel_popup_content/RewardContainer";
import {WheelContainer} from "./wheel_popup_content/WheelContainer";


export class WheelPopupContent extends Sprite {
    private wheelContainer: WheelContainer;
    private reward: RewardContainer;
    private claimCoins: ClaimCoins;
    private onWheelSpinBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.onGameScaleChanged();
        this.onWheelSpinBindThis = this.onWheelSpin.bind(this);
        addEventListener(GameEvents.WHEEL_SPIN, this.onWheelSpinBindThis);
    }

    createChildren(): void {
        this.reward = new RewardContainer();
        this.wheelContainer = new WheelContainer();
        this.claimCoins = new ClaimCoins();
    }

    addChildren(): void {
        this.addChild(this.wheelContainer);
        this.addChild(this.reward);
        this.addChild(this.claimCoins);
    }

    onGameScaleChanged(): void {
        this.wheelContainer.closeButton.x = DominoGame.instance.screenW / 2 - 70;
        this.wheelContainer.closeButton.y = -DominoGame.instance.screenH / 2 + 70;
        this.wheelContainer.background.onGameScaleChanged();
    }

    async onWheelSpin(): Promise<void> {
        let sector: WheelSector = await SocketService.wheelSpin();
        SoundsPlayer.play("wheelSpin");
        await this.wheelContainer.wheel.animateSpin(sector);
        await Timeout.seconds(1);
        this.wheelContainer.filters = [new filters.BlurFilter(10, 5)];
        this.reward.show(sector.coins);
    }

    destroy(): void {
        removeEventListener(GameEvents.WHEEL_SPIN, this.onWheelSpinBindThis);
        this.onWheelSpinBindThis = null;

        this.removeChild(this.wheelContainer);
        this.removeChild(this.reward);
        this.removeChild(this.claimCoins);

        this.wheelContainer.destroy();
        this.reward.destroy();
        this.claimCoins.destroy();

        this.wheelContainer = null;
        this.reward = null;
        this.claimCoins = null;

        super.destroy();
    }
}
