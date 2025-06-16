import {GameMode} from "../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {GameType} from "../services/socket_service/socket_message_data/socket_game_config/GameType";
import {IRoundUser} from "./IRoundUser";
import {SocketGameRequestState} from "./SocketGameRequestState";


export class SocketGameRequest {
    createdAt: "2024-09-04T13:44:53.827Z";
    duration: 57710;
    failExp: 20;
    fake: false;
    gameId: string;
    id: string;
    mode: GameMode;
    myScore: 0;
    otherScore: 0;
    preferredPlace: null;
    prevExperience: 0;
    prevLevel: 1;
    privateId: null;
    queue: IRoundUser[];
    reason: Reason;
    rewardExperience: 0;
    starReward: 0;
    state: SocketGameRequestState;
    sysMsg: "afk";
    testGroup: "default";
    type: GameType;
    userId: 615;
    winExp: 30;
    workerId: "domino-1-worker-1";
    workerUrl: "https://domino-1-worker-1.k8s.azurgames.dev";
    rewardCoins: number;
    rounds: number;
    roundsWon: number;
}

export enum Reason {
    AFK = "afk",
    EXIT = "exit",
    LOW_COINS = "lowCoins",
    HIGH_COINS = "highCoins",
}