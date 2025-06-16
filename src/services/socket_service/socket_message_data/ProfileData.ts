import {PlayerData} from "./profile_data/PlayerData";
import {Stats} from "./profile_data/Stats";


export interface ProfileData extends PlayerData {
    coins: number,
    createdAt: string,
    experience: number,
    fbConnected: boolean,
    lastVisit: string,
    nextLevelProgress: number,
    online: boolean,
    stats: Stats,
    subsItems: Array<unknown>,
    updatedAt: string,
    friendsCount: number,
    wheelNextAt: string,
    wheelDoubleCoins: number | null
}