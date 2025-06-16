import {CoreStaticData} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "./DynamicData";
import {SocketGameConfig} from "./services/socket_service/socket_message_data/SocketGameConfig";


export class StaticData extends CoreStaticData {
    static getCurrentGameConfig(): SocketGameConfig {
        return StaticData.gamesConfig.find(gameConfig => gameConfig.gameMode == DynamicData.socketGameRequest?.mode && gameConfig.gameType == DynamicData.socketGameRequest?.type);
    }
}

