import {BaseScreen} from "./BaseScreen";
import {LobbyBackground} from "./lobby_screen/LobbyBackground";
import {LobbyHeader} from "./lobby_screen/LobbyHeader";
import {ScreenType} from "./ScreenType";
import {LobbyRooms} from "./lobby_screen/LobbyRooms";


export class LobbyScreen extends BaseScreen {
    private background: LobbyBackground;
    private header: LobbyHeader;
    private rooms: LobbyRooms;

    constructor() {
        super(ScreenType.LOBBY);
        this.createChildren();
        this.addChildren();
        this.onGameScaleChanged();
    }

    createChildren(): void {
        this.background = new LobbyBackground();
        this.header = new LobbyHeader();
        this.rooms = new LobbyRooms();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.header);
        this.addChild(this.rooms);
    }

    onGameScaleChanged(): void {
        this.rooms.resize();
        this.header.resize();
    }

    destroy(): void {
        this.removeChild(this.header);
        this.removeChild(this.rooms);
        this.header.destroy();
        this.rooms.destroy();
        this.header = null;
        this.rooms = null;
        super.destroy();
    }

}