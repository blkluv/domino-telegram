import {DisplayObjectFactory, GameType, LanguageText, Pivot, Tab, TabData} from "@azur-games/pixi-vip-framework";


export class RoomsTab extends Tab<GameType> {
    constructor(public data: TabData<GameType>, public onTabClickEventName: string) {
        super(data, onTabClickEventName);
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.activeTitleText = new LanguageText({key: this.data.titleTextKey, fontSize: 28, fontWeight: "500"});
        this.inactiveBackground = DisplayObjectFactory.createNineSlicePlane("lobby/dark_blue_frame", 32, 32, 32, 32);
        this.activeBackground = DisplayObjectFactory.createNineSlicePlane(this.data.backgroundTextureName, 36, 36, 36, 40);
    }

    addChildren(): void {
        this.addChild(this.activeBackground);
        this.addChild(this.inactiveBackground);
        this.addChild(this.activeTitleText);
    }

    initChildren(): void {
        this.inactiveBackground.width = 138;
        this.inactiveBackground.height = 68;
        this.activeBackground.width = 142;
        this.activeBackground.height = 72;

        Pivot.center(this.activeTitleText);
        Pivot.center(this.inactiveBackground);
        Pivot.center(this.activeBackground);

        this.activeBackground.y = 4;
    }
}