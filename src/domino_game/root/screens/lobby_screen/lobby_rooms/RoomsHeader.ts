import {Button, GameType} from "@azur-games/pixi-vip-framework";
import {Container, Point} from "pixi.js";
import {FilterLobbyRooms, GameEvents} from "../../../../../GameEvents";
import {RoomsTabs} from "./rooms_header/RoomsTabs";


export class RoomsHeader extends Container {
    private sitNowToggleState: boolean = false;
    private selectedRoomType: GameType;
    private tabs: RoomsTabs;
    private sitNowToggle: Button;
    private onTabClickedBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onTabClickedBindThis = this.onTabClicked.bind(this);
        addEventListener(GameEvents.LOBBY_ROOMS_TAB_CLICKED, this.onTabClickedBindThis);
    }

    createChildren(): void {
        this.tabs = new RoomsTabs();
        this.sitNowToggle = new Button({
            callback: this.onSitNowToggle.bind(this),
            bgTextureName: "lobby/selector_off",
            textKey: "Sit now:",
            fontSize: 28,
            fontWeight: "400",
            textPosition: new Point(-130, 0),
            fontColor: 0x3F62B8
        });
    }

    addChildren(): void {
        this.addChild(this.tabs);
        this.addChild(this.sitNowToggle);
    }

    initChildren(): void {
        this.tabs.x = -405;
        this.sitNowToggle.x = 405;
    }

    private onSitNowToggle(): void {
        this.sitNowToggleState = !this.sitNowToggleState;
        this.sitNowToggle.changeBackgroundImage(`lobby/selector${this.sitNowToggleState ? "" : "_off"}`);
        this.filterRooms();
    }

    onTabClicked(e: MessageEvent) {
        if (this.selectedRoomType == e.data.name) {
            this.selectedRoomType = null;
            this.tabs.activeTab.active = false;
        } else {
            this.selectedRoomType = e.data.name;
        }
        this.filterRooms();
    }

    filterRooms(): void {
        dispatchEvent(new FilterLobbyRooms({isSitNow: this.sitNowToggleState, gameType: this.selectedRoomType}));
    }

    destroy(): void {
        removeEventListener(GameEvents.LOBBY_ROOMS_TAB_CLICKED, this.onTabClickedBindThis);
        this.onTabClickedBindThis = null;

        this.removeChild(this.sitNowToggle);
        this.removeChild(this.tabs);
        this.sitNowToggle.destroy();
        this.tabs.destroy();
        this.sitNowToggle = null;
        this.tabs = null;
        super.destroy();
    }
} 