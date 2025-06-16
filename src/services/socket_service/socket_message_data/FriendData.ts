import {FriendStatus} from "./friend_data/FriendStatus";
import {ProfileData} from "./ProfileData";


export type FriendData = {
    createdAt: string;
    icon: string;
    id: number;
    lastVisit: string;
    name: string;
    online: boolean;
    profile: ProfileData;
    type: FriendStatus
}