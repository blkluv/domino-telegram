import {Direction, GameType, TabData, Tabs, TabsOptions} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../GameEvents";
import {RoomsTab} from "./rooms_tabs/RoomsTab";


export class RoomsTabs extends Tabs<RoomsTab, GameType> {
    constructor() {
        let tabsConfig: TabData<GameType>[] = [
            {titleTextKey: "Low", name: GameType.HARD1, backgroundTextureName: "lobby/tab_green"},
            {titleTextKey: "Mid", name: GameType.HARD2, backgroundTextureName: "lobby/tab_blue"},
            {titleTextKey: "High", name: GameType.HARD3, backgroundTextureName: "lobby/tab_purple"},
            {titleTextKey: "VIP", name: GameType.HARD4, backgroundTextureName: "lobby/tab_orange"},
        ];
        let options: TabsOptions = {direction: Direction.HORIZONTAL, animated: false, betweenItems: 162};
        super(tabsConfig.map(config => new RoomsTab(config, GameEvents.LOBBY_ROOMS_TAB_CLICKED)), options);
    }
}
