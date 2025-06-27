import {FrameworkEvents, GameType} from "@azur-games/pixi-vip-framework";


export class GameEvents extends FrameworkEvents {
    static GAME_STATE_UPDATE: string = "GAME_STATE_UPDATE";
    static OPEN_PROFILE_POPUP: string = "OPEN_PROFILE_POPUP";
    static CLOSE_PROFILE_POPUP: string = "CLOSE_PROFILE_POPUP";
    static PROFILE_TAB_CLICKED: string = "PROFILE_TAB_CLICKED";
    static OPEN_EDIT_PROFILE_POPUP: string = "OPEN_EDIT_NAME_POPUP";
    static CLOSE_EDIT_PROFILE_POPUP: string = "CLOSE_EDIT_NAME_POPUP";
    static CLOSE_SETTINGS_POPUP: string = "CLOSE_SETTINGS_POPUP";
    static OPEN_SETTINGS_POPUP: string = "OPEN_SETTINGS_POPUP";
    static CLOSE_FRIENDS_POPUP: string = "CLOSE_FRIENDS_POPUP";
    static OPEN_FRIENDS_POPUP: string = "OPEN_FRIENDS_POPUP";
    static FRIENDS_TAB_CLICKED: string = "FRIENDS_TAB_CLICKED";
    static ON_FRIENDS_SEARCH: string = "ON_FRIENDS_SEARCH";
    static ON_FRIENDS_CHANGE: string = "ON_FRIENDS_CHANGE";
    static PROFILE_UPDATED: string = "PROFILE_UPDATED";
    static DOMINO_PLAYED: string = "DOMINO_PLAYED";
    static DOMINO_PLACE_CHANGED: string = "DOMINO_PLACE_CHANGED";
    static WHEEL_UPDATED: string = "GameEvents.WHEEL_UPDATED";
    static CLOSE_WHEEL_POPUP: string = "CLOSE_WHEEL_POPUP";
    static OPEN_WHEEL_POPUP: string = "OPEN_WHEEL_POPUP";
    static WHEEL_SPIN: string = "WHEEL_SPIN";
    static DOMINO_FROM_BAZAR: string = "DOMINO_FROM_BAZAR";
    static HIDE_END_ROUND_POPUP: string = "HIDE_END_ROUND_POPUP";
    static DOMINO_CLICKED: string = "DOMINO_CLICKED";
    static CLOSE_MESSAGES_POPUP: string = "CLOSE_MESSAGES_POPUP";
    static OPEN_MESSAGES_POPUP: string = "OPEN_MESSAGES_POPUP";
    static ON_CHATS_SEARCH: string = "ON_CHATS_SEARCH";
    static ON_CHAT_INPUT: string = "ON_CHAT_INPUT";
    static USER_MESSAGES_STATUSES_CHANGED: "USER_MESSAGES_STATUSES_CHANGED";
    static OPEN_CHAT: string = "OPEN_CHAT";
    static ON_CHAT_MESSAGE: string = "ON_CHAT_MESSAGE";
    static MESSAGES_LIST_SCROLL: string = "MESSAGES_LIST_SCROLL";
    static CHOOSE_AVATAR: string = "CHOOSE_AVATAR";
    static SETTING_PAGE_CHANGE: string = "SETTING_PAGE_CHANGE";
    static TARGET_REACHED: string = "TARGET_REACHED";
    static SPINNER: string = "SPINNER";
    static DOMINO: string = "DOMINO";
    static FLY_POINTS: string = "FLY_POINTS";
    static CLOSE_STORE_POPUP: string = "CLOSE_STORE_POPUP";
    static OPEN_STORE_POPUP: string = "OPEN_STORE_POPUP";
    static ON_CLAIM_COINS: string = "ON_CLAIM_COINS";
    static OPEN_LEAVE_GAME_POPUP: string = "OPEN_LEAVE_GAME_POPUP";
    static CLOSE_LEAVE_GAME_POPUP: string = "CLOSE_LEAVE_GAME_POPUP";
    static OPEN_LEVEL_UP_POPUP: string = "OPEN_LEVEL_UP_POPUP";
    static CLOSE_LEVEL_UP_POPUP: string = "CLOSE_LEVEL_UP_POPUP";
    static OPEN_TUTORIAL_POPUP: string = "OPEN_TUTORIAL_POPUP";
    static CLOSE_TUTORIAL_POPUP: string = "CLOSE_TUTORIAL_POPUP";
    static TUTORIAL_GAME_MODE_CHOSEN: string = "TUTORIAL_GAME_MODE_CHOSEN";
    static TUTORIAL_GAME_PHASE_CHOSEN: string = "TUTORIAL_GAME_PHASE_CHOSEN";
    static OPEN_GIFTS_PANEL: string = "OPEN_GIFTS_PANEL";
    static CLOSE_GIFTS_PANEL: string = "CLOSE_GIFTS_PANEL";
    static BAZAR_BACK_UPDATE: string = "BAZAR_BACK_UPDATE";
    static SITS_RESIZED: string = "SITS_RESIZED";
    static BAZAR_ICON_RESIZED: string = "BAZAR_ICON_RESIZED";
    static DOMINO_DRAGGING: string = "DOMINO_DRAGGING";
    static DOMINO_POINTERDOWN: string = "DOMINO_POINTERDOWN";
    static DRAG_OVER_HAND: string = "DRAG_OVER_HAND";
    static DRAG_OVER_TABLE: string = "DRAG_OVER_TABLE";
    static LOBBY_SELECT_GAME_MODE: string = "LOBBY_SELECT_GAME_MODE";
    static OPPONENT_FOUND: string = "OPPONENT_FOUND";
    static CLOSE_MENU_AND_BAZAR: string = "CLOSE_MENU_AND_BAZAR";
    static CLOSE_TABLE_CHAT: string = "CLOSE_TABLE_CHAT";
    static SPECTATING: string = "SPECTATING";
    static OPEN_INPUT_POPUP: string = "OPEN_INPUT_POPUP";
    static CLOSE_INPUT_POPUP: string = "CLOSE_INPUT_POPUP";
    static FILTER_LOBBY_ROOMS: string = "FILTER_LOBBY_ROOMS";
    static LOBBY_ROOMS_TAB_CLICKED: string = "LOBBY_ROOMS_TAB_CLICKED";
}

export type FilterLobbyRoomsPayload = {
    isSitNow: boolean;
    gameType: GameType
}

export class FilterLobbyRooms extends CustomEvent<FilterLobbyRoomsPayload> {
    constructor(detail: FilterLobbyRoomsPayload) {
        super(GameEvents.FILTER_LOBBY_ROOMS, {detail});
    }
}

