import {NineSlicePlane, Point} from "pixi.js";
import {ScrollContainer} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {FriendsListItem} from "../current_friends_page/friends_list/FriendsListItem";


export class FoundedProfilesList extends ScrollContainer<FriendsListItem> {
    private bottomGradient: NineSlicePlane;

    constructor() {
        super({maskSizes: new Point(960, 490), maskPosition: new Point(0, 229), marginBetweenItems: 140, scrollBarTexture: "messages/scrollbar_bg"});
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

        this.bottomGradient.y = 455;
        this.bottomGradient.x = 1;
        this.scrollBar.x = 458;
    }

    destroy(): void {
        this.removeChild(this.bottomGradient);
        this.bottomGradient.destroy();
        this.bottomGradient = null;

        super.destroy();
    }
}
