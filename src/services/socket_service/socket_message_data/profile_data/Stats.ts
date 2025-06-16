import {GameMode} from "../socket_game_config/GameMode";
import {StatByGame} from "./stats/StatByGame";
import {TournamentPrizes} from "./stats/TournamentPrizes";


export type Stats = {
    gameCount: number,
    leftGameCount: number,
    monthlyGameCount: number,
    monthlyWonGamecount: number,
    statByGame: { [key in GameMode]: StatByGame },
    tournamentPrizes: TournamentPrizes,
    tournaments: number,
    wonGameCount: number,
}
