import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../DynamicData";
import {LanguageService} from "@azur-games/pixi-vip-framework";
import {GameMode} from "../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SocketGameConfig} from "../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {StaticData} from "../../../../StaticData";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Spinner} from "./table_loader/Spinner";


export class TableLoader extends Sprite {
    private spinner: Spinner;
    private price: number;
    private modeAndPrice: LanguageText;
    private lookingForPlayersText: LanguageText;

    constructor() {
        super();
        let gameConfig: SocketGameConfig = StaticData.gamesConfig.find(gameConfig => gameConfig.gameMode == DynamicData.socketGameRequest.mode && gameConfig.gameType == DynamicData.socketGameRequest.type);
        this.price = gameConfig.gameMode == GameMode.PRO ? gameConfig.bet : gameConfig.cost;
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.spinner = new Spinner();
        this.modeAndPrice = new LanguageText({
            key: (LanguageService.getTextByKey("Back/GameMode/" + DynamicData.socketGameRequest.mode.toUpperCase()) + " | " + this.price).toUpperCase(),
            fill: 0,
            fontSize: 50
        });
        this.lookingForPlayersText = new LanguageText({key: "We are looking for players", fontSize: 35, fontWeight: "600"});
    }

    addChildren(): void {
        this.addChild(this.spinner);
        this.addChild(this.modeAndPrice);
        this.addChild(this.lookingForPlayersText);
    }

    initChildren(): void {
        this.spinner.scale.set(.8);
        this.modeAndPrice.alpha = .41;
        this.lookingForPlayersText.alpha = .41;

        Pivot.center(this.modeAndPrice);
        Pivot.center(this.lookingForPlayersText);

        this.spinner.y = -70;
        this.modeAndPrice.y = 70;
        this.lookingForPlayersText.y = 135;
    }

    destroy(): void {
        super.destroy();
    }
}
