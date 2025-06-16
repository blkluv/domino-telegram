import {Sprite} from "pixi.js";
import {DynamicData} from "../../../../../DynamicData";
import {SocketGameConfig} from "../../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {StaticData} from "../../../../../StaticData";
import {EndGameLineLight} from "./EndGameLineLight";
import {EndGameSummaryBlock} from "./EndGameSummaryBlock";
import {EndGameSummaryText} from "./EndGameSummaryText";


export class EndGameSummary extends Sprite {
    private lineLight: EndGameLineLight;
    private endGameSummaryText: EndGameSummaryText;
    private summaryXp: EndGameSummaryBlock;
    private summaryCoins: EndGameSummaryBlock;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    destroy() {
        this.removeChild(this.lineLight);
        this.removeChild(this.endGameSummaryText);
        this.removeChild(this.summaryXp);
        this.removeChild(this.summaryCoins);

        this.lineLight.destroy();
        this.endGameSummaryText.destroy();
        this.summaryXp.destroy();
        this.summaryCoins.destroy();

        this.lineLight = undefined;
        this.endGameSummaryText = undefined;
        this.summaryXp = undefined;
        this.summaryCoins = undefined;

        super.destroy();
    }

    private createChildren() {
        let req = DynamicData.socketGameRequest;
        this.lineLight = new EndGameLineLight();
        this.endGameSummaryText = new EndGameSummaryText();
        this.summaryXp = new EndGameSummaryBlock("table/end_game/xp", 0xF0B2FF, 0x49165B, DynamicData.socketGameRequest.rewardExperience);
        let gameConfig: SocketGameConfig = StaticData.getCurrentGameConfig();
        let reward: number = DynamicData.socketGameRequest.rewardCoins || (gameConfig.bet > 0 ? -gameConfig.bet : -gameConfig.cost);
        let negative: boolean = reward < 0;
        this.summaryCoins = new EndGameSummaryBlock("table/end_game/coin" + (negative ? "_bw" : ""), negative ? 0xb9b9b9 : 0xFFDA97, negative ? 0x3c3c3c : 0x5B2F16, reward);
    }

    private addChildren() {
        this.addChild(this.lineLight);
        this.addChild(this.endGameSummaryText);
        this.addChild(this.summaryXp);
        this.addChild(this.summaryCoins);
    }

    private initChildren() {
        this.lineLight.y = -50;
        this.endGameSummaryText.y = 30;
        this.summaryCoins.y = this.summaryXp.y = 150;
        this.summaryCoins.x = 100;
        this.summaryXp.x = -this.summaryCoins.x;
    }
}