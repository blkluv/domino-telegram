import {ScrollItem} from "@azur-games/pixi-vip-framework";
import {AvatarsListItem} from "./avatars_list_row/AvatarsListItem";


export class AvatarsListRow extends ScrollItem {
    private items: AvatarsListItem[] = [];

    constructor(private avatars: string[]) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.avatars.forEach(avatar => {
            this.items.push(new AvatarsListItem(avatar));
        });
    }

    addChildren(): void {
        this.items.forEach(item => this.addChild(item));
    }

    initChildren(): void {
        this.items.forEach((item: AvatarsListItem, i: number): void => {
            item.x = i * 200 - 300;
        });
    }

    setDragged(dragged: boolean = true) {
        this.items.forEach(item => item.setDragged(dragged));
    }

    destroy(): void {
        let item: AvatarsListItem;
        while (this.items.length) {
            item = this.items.shift();
            this.removeChild(item);
            item.destroy();
        }
        this.items = null;
        super.destroy();
    }
}
