import {Button} from "@azur-games/pixi-vip-framework";
import {Point} from "pixi.js";
import {SocketGameConfig} from "../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {SocketService} from "../../../../services/SocketService";


export class GameButton extends Button {
    constructor(private gameConfig: SocketGameConfig) {
        super({
            bgTextureName: "common/green_button",
            bgCornersSize: 34,
            bgSizes: new Point( 300, 80),
            textKey: gameConfig.minBalanceCoins.toString(),
            fontSize: 40,
            fontWeight: "400",
            textPosition: new Point(0, -4)
        });
    }

    processClick() {
        console.log("gameConfig", this.gameConfig);
        SocketService.createGameRequest(this.gameConfig.gameType, this.gameConfig.gameMode)
    }
}
