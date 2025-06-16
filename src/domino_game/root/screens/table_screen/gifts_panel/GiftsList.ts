import {NineSlicePlane, Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {ItemsService} from "@azur-games/pixi-vip-framework";

import {Pivot} from "@azur-games/pixi-vip-framework";
import {GiftsListItem} from "./gifts_list/GiftsListItem";


export class GiftsList extends Sprite {
    background: NineSlicePlane;
    list: GiftsListItem[] = [];

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.background.interactive = true;
        this.background.buttonMode = false;
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("table/gifts/gifts_bg", 64, 64, 64, 84);
        ItemsService.giftsConfig.forEach(config => this.list.push(new GiftsListItem(config)));

    }

    addChildren(): void {
        this.addChild(this.background);
        this.list.forEach(item => this.addChild(item));
    }

    initChildren(): void {
        this.background.width = 1150;
        this.background.height = 250;
        Pivot.center(this.background);
        this.background.y = 20;
        this.list.forEach((item, i) => item.x = i * 130 - 462);
    }

    destroy(): void {
        this.removeChild(this.background);
        this.background.destroy();
        this.background = null;

        while (this.list.length) {
            let item: GiftsListItem = this.list.shift();
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        this.list = null;

        super.destroy();
    }
}
