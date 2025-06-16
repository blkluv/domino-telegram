import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";

import {Pivot} from "@azur-games/pixi-vip-framework";


export class GiftListItemCount extends Sprite {
    private background: Sprite;
    private countText: LanguageText;

    constructor(private count: number) {
        super();
        if (!count) {
            return;
        }
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("table/gifts/gift_count_bg");
        this.countText = new LanguageText({key: this.count.toString(), fontSize: 20});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.countText);
    }

    changeCount(count: number): void {
        this.count = count;
        console.log("LOG: count --> ", count);
        if (!this.count) {
            this.visible = false;
            return;
        }
        this.visible = true;
        this.countText.changeText(count.toString());
    }

    initChildren(): void {
        Pivot.center(this.background);
        Pivot.center(this.countText);
        this.background.y = 22;
    }

    destroy(): void {
        if (this.count) {
            this.removeChild(this.background);
            this.removeChild(this.countText);
            this.background.destroy();
            this.countText.destroy();
            this.background = null;
            this.countText = null;
        }

        super.destroy();
    }
}
