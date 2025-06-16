import {DynamicData} from "../DynamicData";
import {PreloaderService} from "@azur-games/pixi-vip-framework";
import {FullProfileData} from "../services/socket_service/socket_message_data/profile_data/FullProfileData";
import {StatByGame} from "../services/socket_service/socket_message_data/profile_data/stats/StatByGame";
import {ProfileData} from "../services/socket_service/socket_message_data/ProfileData";
import {GameMode} from "../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SocketService} from "../services/SocketService";
import {RoundUser} from "./RoundUser";


export class Profiles {
    private fullProfileById: Map<number, FullProfileData> = new Map();
    private profileById: Map<number, ProfileData> = new Map();
    private roundUserById: Map<number, RoundUser> = new Map();

    setFullProfileById(id: number, fullProfile: FullProfileData): void {
        this.fullProfileById.set(id, fullProfile);
    }

    async getFullProfileById(id: number): Promise<FullProfileData> {
        if (id == DynamicData.myProfile.id) {
            return DynamicData.myProfile;
        }
        let fullProfile: FullProfileData = this.fullProfileById.get(id);
        if (!fullProfile) {
            let preloaderId: number = PreloaderService.show();
            fullProfile = id > 0 ? await SocketService.getPlayerProfileData(id) : null;
            this.setFullProfileById(id, Profiles.setProfileStatsEmptyValues(fullProfile));
            PreloaderService.hide(preloaderId);
        }
        return fullProfile;
    }

    setFullProfileNameById(id: number, name: string): void {
        let fullProfile: FullProfileData = this.fullProfileById.get(id);
        if (!fullProfile) {
            return;
        }
        fullProfile.name = name;
    }

    setFullProfileIconById(id: number, icon: string): void {
        let fullProfile: FullProfileData = this.fullProfileById.get(id);
        if (!fullProfile) {
            return;
        }
        fullProfile.icon = icon;
    }

    static setProfileStatsEmptyValues(profile: ProfileData): ProfileData {
        let emptyStat: StatByGame = {
            coins: 0,
            rating: 0,
            bestScore: 0,
            gameCount: 0,
            sentGifts: 0,
            winStreak: 0,
            wonRounds: 0,
            bestRating: 0,
            lostRounds: 0,
            tournaments: 0,
            curWinStreak: 0,
            wonGameCount: 0,
            leftGameCount: 0,
            receivedGifts: 0,
            tournamentPrizes: {
                gold: 0,
                bronze: 0,
                silver: 0
            }
        };
        let stat: GameMode;
        for (stat in profile.stats.statByGame) {
            Object.keys(profile.stats.statByGame[stat]).length === 0 && (profile.stats.statByGame[stat] = emptyStat);
        }
        return profile;
    };

    setProfileById(id: number, profile: ProfileData): void {
        this.profileById.set(id, profile);
    }

    getProfileById(id: number): ProfileData {
        return this.profileById.get(id);
    }

    setRoundUserById(id: number, roundUser: RoundUser): void {
        this.roundUserById.set(id, roundUser);
    }

    getRoundUserById(playerId: number): RoundUser {
        let roundUser: RoundUser = this.roundUserById.get(playerId);
        if (!roundUser) {
            roundUser = DynamicData.socketGameRequest.queue.find(item => item.id == playerId);
            this.setRoundUserById(playerId, roundUser);
        }
        return roundUser;
    }
}