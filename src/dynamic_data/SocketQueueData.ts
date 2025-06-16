import {SocketMessageType} from "../services/socket_service/SocketMessageType";
import {GameMessage} from "./GameMessage";
import {ISocketGameState} from "./ISocketGameState";
import {SitPlace} from "./SitPlace";
import {SocketPhrase} from "./SocketPhrase";


export type SocketQueueData = {
    messageType: SocketMessageType;
    messageData: ISocketGameState | SocketPhrase | GameMessage;
    messagePlace: SitPlace;
    fast?: boolean
}
