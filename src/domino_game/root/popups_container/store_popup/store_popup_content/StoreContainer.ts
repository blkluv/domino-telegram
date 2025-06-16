import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextCaseFormat} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {StoreItems} from "./store_container/StoreItems";


export class StoreContainer extends Sprite {
    private title: LanguageText;
    background: Sprite;
    private storeItems: StoreItems;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("store/Store_Art");
        this.title = new LanguageText({key: "Lobby/STORE", fontSize: 65, fill: 0xffffff, centerAfterLanguageChanged: true, textFormat: TextCaseFormat.UPPERCASE});
        this.storeItems = new StoreItems();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.title);
        this.addChild(this.storeItems);
    }

    initChildren(): void {
        this.title.setTextStroke(0x9F755A, 10);

        Pivot.center(this.background);
        Pivot.center(this.title);

        this.title.y = -425;
    }

    destroy(): void {
        this.removeChild(this.title);
        this.removeChild(this.background);
        this.removeChild(this.storeItems);

        this.title.destroy();
        this.background.destroy();
        this.storeItems.destroy();

        this.title = null;
        this.background = null;
        this.storeItems = null;

        super.destroy();
    }

}
