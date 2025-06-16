import {ProfileBadge} from "./ProfileBadge";


export interface PlayerData {
    id: number,
    name: string,
    icon: string | null,
    level: number,
    badges?: ProfileBadge[],
    fbConnected?: boolean,
    nextLevelProgress?: number;
    online?: boolean
}