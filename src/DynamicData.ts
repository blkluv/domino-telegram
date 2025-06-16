import {ISocketGameState} from "./dynamic_data/ISocketGameState";
import {Profiles} from "./dynamic_data/Profiles";
import {SitPlace} from "./dynamic_data/SitPlace";
import {SocketGameRequest} from "./dynamic_data/SocketGameRequest";
import {FriendData} from "./services/socket_service/socket_message_data/FriendData";
import {ProfileData} from "./services/socket_service/socket_message_data/ProfileData";
import {GameMode} from "./services/socket_service/socket_message_data/socket_game_config/GameMode";
import {UserEventMessage} from "./services/socket_service/socket_message_data/UserEventMessage";
import {WheelConfig} from "./services/socket_service/socket_message_data/WheelConfig";


export class DynamicData {
    static socketGameRequest: SocketGameRequest;
    static socketGameState: ISocketGameState;
    static myFriends: FriendData[];
    static myProfile: ProfileData;
    static myCoinsOnGameStart: number;
    static profiles: Profiles = new Profiles();
    static wheel: WheelConfig;
    static wheelResponseTime: number;
    static userEventsMessages: UserEventMessage[];
    static exitPlayer: SitPlace;

    static get fives(): boolean {
        return DynamicData.socketGameRequest.mode == GameMode.FIVES;
    }

    static get kingMode(): boolean {
        return DynamicData.socketGameRequest.mode == GameMode.PRO;
    }
}