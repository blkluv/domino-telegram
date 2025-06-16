import {Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {ShareContainer} from "./friends_share_page/ShareContainer";


export class FriendsSharePage extends Sprite {
    private background: Sprite;
    private shareContainer: ShareContainer;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("friends/bg-art");
        this.shareContainer = new ShareContainer();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.shareContainer);
    }

    initChildren(): void {
        Pivot.center(this.background);
        this.shareContainer.x = 110;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.shareContainer);

        this.background.destroy();
        this.shareContainer.destroy();

        this.background = null;
        this.shareContainer = null;

        super.destroy();
    }
}
