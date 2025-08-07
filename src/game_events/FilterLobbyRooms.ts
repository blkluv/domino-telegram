import {GameType} from "@azur-games/pixi-vip-framework/src";
import {GameEvents} from "../GameEvents";


export type FilterLobbyRoomsPayload = {
    isSitNow: boolean;
    gameType: GameType
}

export class FilterLobbyRooms extends CustomEvent<FilterLobbyRoomsPayload> {
    constructor(detail: FilterLobbyRoomsPayload) {
        super(GameEvents.FILTER_LOBBY_ROOMS, {detail});
    }
}