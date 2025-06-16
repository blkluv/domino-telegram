import {DynamicData} from "../DynamicData";
import {Gender} from "./avatar_service/avatar_config/Gender";
import {AvatarConfig} from "./avatar_service/AvatarConfig";
import {PlayerData} from "./socket_service/socket_message_data/profile_data/PlayerData";
import {SocketService} from "./SocketService";


export class AvatarService {

    public static avatars: AvatarConfig[] = [
        {icon: "1", textureName: "avatars/1", gender: Gender.W},
        {icon: "2", textureName: "avatars/2", gender: Gender.M},
        {icon: "3", textureName: "avatars/3", gender: Gender.W},
        {icon: "4", textureName: "avatars/4", gender: Gender.M},
        {icon: "5", textureName: "avatars/5", gender: Gender.W},
        {icon: "6", textureName: "avatars/6", gender: Gender.M},
        {icon: "7", textureName: "avatars/7", gender: Gender.W},
        {icon: "8", textureName: "avatars/8", gender: Gender.W},
        {icon: "9", textureName: "avatars/9", gender: Gender.M},
        {icon: "10", textureName: "avatars/10", gender: Gender.M},
    ];

    static getGenderByTextureName(icon: string): Gender {
        let avatarConfig: AvatarConfig = AvatarService.avatars.find(config => config.textureName == icon);
        if (!avatarConfig) {
            debugger;
        }
        return avatarConfig.gender;
    }

    private static avatarExist(icon: string): boolean {
        return AvatarService.avatars.some(config => config.icon == icon);
    }

    static getTextureNameByIcon(icon: string): string {
        let avatarConfig: AvatarConfig = AvatarService.avatars.find(config => config.icon == icon);
        return avatarConfig.textureName;
    }

    static getIconByTextureName(textureName: string): string {
        let avatarConfig: AvatarConfig = AvatarService.avatars.find(config => config.textureName == textureName);
        return avatarConfig.icon;
    }

    static getAvatarTextureNameByProfile(profileData: PlayerData): string {
        let icon: string = profileData.icon;
        if (!icon || !AvatarService.avatarExist(icon)) {
            let hash: number = AvatarService.getHashCode((profileData.id < 0 ? profileData.name : profileData.id.toString()) + "shit") % AvatarService.avatars.length + 1;
            icon = hash.toString();
            profileData.id == DynamicData.myProfile.id && SocketService.setPlayerIcon(icon);
        }
        return AvatarService.getTextureNameByIcon(icon);
    }

    private static getHashCode(s: string): number {
        let hash: number = 0;
        let char: number;
        for (let charIndex: number = 0; charIndex < s.length; charIndex++) {
            char = s.charCodeAt(charIndex);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}