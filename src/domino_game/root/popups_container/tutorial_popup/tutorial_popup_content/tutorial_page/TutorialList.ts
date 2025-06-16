import {NineSlicePlane, Point} from "pixi.js";
import {ScrollContainer} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework"


import {Pivot} from "@azur-games/pixi-vip-framework"
import {TutorialListItem} from "./TutorialListItem";


export class TutorialList extends ScrollContainer<TutorialListItem> {
    private topGradient: NineSlicePlane;
    private bottomGradient: NineSlicePlane;

    constructor() {
        super({
            maskSizes: new Point(960, 595),
            maskPosition: new Point(0, 278),
            bottomMargin: 60,
            scrollBarTexture: "messages/scrollbar_bg"
        });
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.topGradient = DisplayObjectFactory.createNineSlicePlane("tutorial/top_list_gradient", 40, 24, 40, 24);
        this.bottomGradient = DisplayObjectFactory.createNineSlicePlane("messages/bottom_gradient", 25, 45, 25, 25);
    }

    addChildren(): void {
        this.addChild(this.topGradient);
        this.addChild(this.bottomGradient);
    }

    initChildren(): void {
        this.bottomGradient.width = 958;
        this.bottomGradient.height = 100;
        this.topGradient.width = 958;
        this.topGradient.height = 100;

        Pivot.center(this.bottomGradient);
        Pivot.center(this.topGradient);

        this.topGradient.y = 18;
        this.bottomGradient.y = 570;

        this.scrollBar.x = 454;
    }

    destroy(): void {
        this.removeChild(this.topGradient);
        this.removeChild(this.bottomGradient);

        this.topGradient.destroy();
        this.bottomGradient.destroy();

        this.topGradient = null;
        this.bottomGradient = null;

        super.destroy();
    }
}
