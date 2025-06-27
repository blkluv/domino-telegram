import {GameMode} from "./socket_game_config/GameMode";
import {GameType} from "@azur-games/pixi-vip-framework";
import {SessionType} from "./socket_game_config/SessionType";


export type SocketGameConfig = {
    commission: number,
    cost?: number,
    bet?: number,
    fakes: number,
    gameMode: GameMode,
    gameType: GameType,
    maxPlayers: PlayersNum,
    minLevel: number,
    minPlayers: PlayersNum,
    minBalanceCoins: number,
    maxBalanceCoins: number,
    players: PlayersNum,
    reward: number,
    sessionType: SessionType
    targetScore: number,
}

export type PlayersNum = 2 | 3 | 4;