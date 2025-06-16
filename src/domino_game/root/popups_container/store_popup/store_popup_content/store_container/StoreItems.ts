import {Sprite} from "pixi.js";
import {ProductTag} from "../../../../../../services/socket_service/socket_message_data/product_data/ProductTag";
import {StaticData} from "../../../../../../StaticData";
import {StoreItem} from "./store_items/StoreItem";


export class StoreItems extends Sprite {
    private items: StoreItem[];

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.items = StaticData.products
            .filter(product => product.tags?.includes(ProductTag.TAB_COINS))
            .map(product => new StoreItem(product));
    }

    addChildren(): void {
        this.items.forEach(item => this.addChild(item));
    }

    initChildren(): void {
        let colCount: number = 3;
        this.items.forEach((item: StoreItem, i: number): void => {
            item.x = -380 + i % colCount * 380;
            item.y = -190 + Math.floor(i / colCount) * 405;
        });
    }

    destroy(): void {
        let item: StoreItem;
        while (this.items.length) {
            item = this.items.shift();
            this.removeChild(item);
            item.destroy();
        }
        this.items = null;
        super.destroy();
    }
}
