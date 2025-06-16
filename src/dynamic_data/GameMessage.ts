import {ChatMessageType} from "./game_message/ChatMessageType";


export type GameMessage = {
    id: string,
    gameId: string,
    senderId: number,
    recipientId: number,
    kind: ChatMessageType,
    body: string
}