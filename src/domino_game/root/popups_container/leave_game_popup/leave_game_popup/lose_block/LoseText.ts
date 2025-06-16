import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {SocketGameConfig} from "../../../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {StaticData} from "../../../../../../StaticData";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class LoseText extends Sprite {
    private gameCost: number;
    private loseText: LanguageText;
    private coinIcon: Sprite;
    private coinsAmountText: LanguageText;
    private margin: number = 10;
    containerWidth: number = 0;

    constructor() {
        super();
        let gameConfig: SocketGameConfig = StaticData.gamesConfig.find(gameConfig => gameConfig.gameMode == DynamicData?.socketGameRequest?.mode && gameConfig.gameType == DynamicData?.socketGameRequest?.type);
        this.gameCost = gameConfig.cost;
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.loseText = new LanguageText({key: "QuitWindow/you-will-lose", fontSize: 44, fill: 0x94653C});
        this.coinIcon = DisplayObjectFactory.createSprite("table/end_game/coin");
        this.coinsAmountText = new LanguageText({key: this.gameCost.toString(), fontSize: 59, fill: [0xFFAB07, 0xFFDF51]});
    }

    addChildren(): void {
        this.addChild(this.loseText);
        this.addChild(this.coinIcon);
        this.addChild(this.coinsAmountText);
    }

    initChildren(): void {
        this.loseText.setTextStroke(0xFFEBD1, 2, false);
        this.coinsAmountText.setTextStroke(0xffffff, 4, false);
        this.coinsAmountText.setTextShadow(0x785A3F, 6, 0, Math.PI / 2, 1, false);

        this.coinIcon.scale.set(.5);
        this.loseText.anchor.set(0, .5);
        Pivot.center(this.coinIcon);
        this.coinsAmountText.anchor.set(0, .5);

        this.coinIcon.x = this.loseText.width + this.margin + this.coinIcon.width / 2;
        this.coinIcon.y = 5;
        this.coinsAmountText.x = this.coinIcon.x + this.coinIcon.width / 2 + this.margin;
        this.containerWidth = this.coinsAmountText.x + this.coinsAmountText.width;

        this.x = -this.containerWidth / 2;
    }

    destroy(): void {
        this.removeChild(this.loseText);
        this.removeChild(this.coinIcon);
        this.removeChild(this.coinsAmountText);

        this.loseText.destroy();
        this.coinIcon.destroy();
        this.coinsAmountText.destroy();

        this.loseText = null;
        this.coinIcon = null;
        this.coinsAmountText = null;

        super.destroy();
    }
}
