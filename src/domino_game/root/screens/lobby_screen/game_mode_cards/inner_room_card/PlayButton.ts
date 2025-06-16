import {Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../DynamicData";
import {GameEvents} from "../../../../../../GameEvents";
import {SocketGameConfig} from "../../../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {SocketService} from "../../../../../../services/SocketService";
import {NumberUtils} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class PlayButton extends Button {
    private anteText: LanguageText;
    private available: boolean;
    private checkAvailabilityBindThis: (e: MessageEvent) => void;

    constructor(private config: SocketGameConfig, private endless: boolean) {
        super({
            bgTextureName: "lobby/btn_green",
            bgCornersSize: 28,
            bgSizes: new Point(260, 100),
            iconTextureName: "common/currency_soft_crown",
            textKey: NumberUtils.coinsKiloFormat(endless ? config.bet : config.cost),
            fontSize: 48,
            autoFitWidth: 140
        });
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.checkAvailability();

        this.checkAvailabilityBindThis = this.checkAvailability.bind(this);
        addEventListener(GameEvents.PROFILE_UPDATED, this.checkAvailabilityBindThis);
    }

    createChildren(): void {
        this.anteText = new LanguageText({key: "Lobby/Ante", fontSize: 18});
    }

    addChildren(): void {
        this.addChild(this.anteText).visible = this.endless;
    }

    initChildren(): void {
        this.icon.scale.set(.45);
        Pivot.center(this.anteText);

        this.languageText.x = this.icon.width / 2;
        this.icon.x = -this.languageText.width / 2;
        this.icon.y = this.endless ? -14 : -2;
        this.languageText.y = this.icon.y - 5;
        this.anteText.y = 22;
    }

    processClick(): void {
        this.playSound();
        this.available
            ? SocketService.createGameRequest(this.config.gameType, this.config.gameMode)
            : dispatchEvent(new MessageEvent(GameEvents.OPEN_STORE_POPUP));
    }

    private checkAvailability(): void {
        let enoughForRegular: boolean = DynamicData.myProfile.coins >= this.config.cost;
        let okForEndless: boolean = DynamicData.myProfile.coins >= this.config.minBalanceCoins && DynamicData.myProfile.coins <= this.config.maxBalanceCoins;
        this.available = this.endless ? okForEndless : enoughForRegular;

        this.changeBackgroundImage(this.available ? "lobby/btn_green" : "lobby/btn_gray");
        this.languageText.style.fill = this.available ? 0xffffff : 0x747373;
        this.languageText.setTextStroke(this.available ? 0x318c10 : 0xBABABA, 4, false);
        this.icon.alpha = this.available ? 1 : .7;
        this.anteText.style.fill = this.available ? 0x308B0F : 0x6D6B6B;
    }

    destroy(): void {
        removeEventListener(GameEvents.PROFILE_UPDATED, this.checkAvailabilityBindThis);
        this.checkAvailabilityBindThis = null;

        this.removeChild(this.anteText);
        this.anteText.destroy();
        this.anteText = null;

        super.destroy();
    }
}
