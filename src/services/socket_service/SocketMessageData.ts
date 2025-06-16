import {ISocketGameState} from "../../dynamic_data/ISocketGameState";
import {SocketGameRequest} from "../../dynamic_data/SocketGameRequest";
import {AuthUserData} from "./AuthUserData";
import {ClientConfig} from "./socket_message_data/ClientConfig";
import {ConsumableItemConfig} from "./socket_message_data/ConsumableItemConfig";
import {EmojiConfig} from "./socket_message_data/EmojiConfig";
import {FriendData} from "./socket_message_data/FriendData";
import {ProductData} from "./socket_message_data/ProductData";
import {ProfileData} from "./socket_message_data/ProfileData";
import {ProfileGiftConfig} from "./socket_message_data/ProfileGiftConfig";
import {QuestConfig} from "./socket_message_data/QuestConfig";
import {SocketGameConfig} from "./socket_message_data/SocketGameConfig";
import {UserEventMessage} from "./socket_message_data/UserEventMessage";
import {UserMessagesStatusById} from "./socket_message_data/UserMessagesStatusById";
import {WheelConfig} from "./socket_message_data/WheelConfig";
import {XsollaItemConfig} from "./socket_message_data/XsollaItemConfig";
import {XsollaSubConfig} from "./socket_message_data/XsollaSubConfig";


export type SocketMessageData =
    ProfileData |
    FriendData[] |
    ProductData[] |
    EmojiConfig[] |
    ProfileGiftConfig[] |
    SocketGameConfig[] |
    ClientConfig |
    ConsumableItemConfig[] |
    WheelConfig |
    QuestConfig |
    XsollaItemConfig[] |
    XsollaSubConfig[] |
    SocketGameRequest |
    ISocketGameState |
    UserMessagesStatusById |
    UserEventMessage[] |
    UserEventMessage |
    number |
    AuthUserData
