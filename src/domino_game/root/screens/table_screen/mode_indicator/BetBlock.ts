import {Sprite, Text} from "pixi.js";
import {DynamicData} from "../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../factories/TextFactory";
import {GameMode} from "../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SocketGameConfig} from "../../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {StaticData} from "../../../../../StaticData";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class BetBlock extends Sprite {
    private coinIcon: Sprite;
    private betText: Text;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        let gameConfig: SocketGameConfig = StaticData.gamesConfig.find(gameConfig => gameConfig.gameMode == DynamicData.socketGameRequest.mode && gameConfig.gameType == DynamicData.socketGameRequest.type);
        let cost: number = gameConfig.gameMode == GameMode.PRO ? gameConfig.bet : gameConfig.cost;
        this.setBetText(cost.toString());
    }

    private createChildren() {
        this.coinIcon = DisplayObjectFactory.createSprite("table/mode_indicator/icon_coin");
        this.betText = TextFactory.createCommissioner({
            value: "",
            fontSize: 44,
        });
    }

    private addChildren() {
        this.addChild(this.coinIcon);
        this.addChild(this.betText);
    }

    private initChildren() {
        Pivot.center(this.coinIcon);

        this.betText.style.stroke = 0x623895;
        this.betText.style.strokeThickness = 4;

        this.betText.y = -3;
    }

    destroy() {
        super.destroy();
    }

    private setBetText(value: string) {
        this.betText.text = value;
        Pivot.center(this.betText);
        this.betText.x = this.coinIcon.width / 2 + 3;
        this.coinIcon.x = -this.betText.width / 2 - 3;
    }
}