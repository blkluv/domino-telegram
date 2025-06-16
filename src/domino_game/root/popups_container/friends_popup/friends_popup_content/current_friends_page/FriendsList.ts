import {DisplayObjectFactory, Pivot, ScrollContainer} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Point} from "pixi.js";
import {FriendsListItem} from "./friends_list/FriendsListItem";


export class FriendsList extends ScrollContainer<FriendsListItem> {
    private bottomGradient: NineSlicePlane;

    constructor() {
        super({maskSizes: new Point(952, 618), maskPosition: new Point(1, 291), marginBetweenItems: 130, scrollBarTexture: "messages/scrollbar_bg"});
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.bottomGradient = DisplayObjectFactory.createNineSlicePlane("messages/bottom_gradient", 8, 8, 8, 8);
    }

    addChildren(): void {
        this.addChild(this.bottomGradient);
    }

    initChildren(): void {
        this.bottomGradient.width = 958;
        this.bottomGradient.height = 100;

        Pivot.center(this.bottomGradient);

        this.bottomGradient.y = 585;
        this.scrollBar.x = 458;
    }

    destroy(): void {
        this.removeChild(this.bottomGradient);
        this.bottomGradient.destroy();
        this.bottomGradient = null;

        super.destroy();
    }
}
