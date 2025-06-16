import {TournamentPrizes} from "./TournamentPrizes";


export type StatByGame = {
    bestRating: number,
    bestScore: number,
    coins: number,
    curWinStreak: number,
    gameCount: number,
    leftGameCount: number,
    lostRounds: number,
    rating: number,
    receivedGifts: number,
    sentGifts: number,
    tournamentPrizes: TournamentPrizes,
    tournaments: number,
    winStreak: number,
    wonGameCount: number,
    wonRounds: number,
}