import {DisplayObjectFactory, Pivot} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Sprite} from "pixi.js";


export abstract class FriendsPage extends Sprite {
    private background: NineSlicePlane;

    protected constructor() {
        super();
        this.background = DisplayObjectFactory.createNineSlicePlane("friends/page_bg", 30, 30, 30, 30);

        this.addChild(this.background);

        this.background.width = 985;
        this.background.height = 652;
        Pivot.center(this.background);
    }

    abstract get dragged(): boolean

    destroy(): void {
        this.removeChild(this.background);
        this.background.destroy();
        this.background = null;

        super.destroy();
    }
}
