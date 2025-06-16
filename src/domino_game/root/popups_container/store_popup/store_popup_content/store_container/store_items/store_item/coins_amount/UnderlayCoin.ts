import {Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class UnderlayCoin extends Sprite {
    private iconBackground: Sprite;
    private icon: Sprite;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.iconBackground = DisplayObjectFactory.createSprite("store/coin_bg");
        this.icon = DisplayObjectFactory.createSprite("common/currency_soft_crown");
    }

    addChildren(): void {
        this.addChild(this.iconBackground);
        this.addChild(this.icon);
    }

    initChildren(): void {
        this.icon.scale.set(.34);
        Pivot.center(this.iconBackground);
        this.icon.pivot.set(67, 67);
    }

    get backgroundWidth(): number {
        return this.iconBackground.width;
    }

    destroy(): void {
        this.removeChild(this.iconBackground);
        this.removeChild(this.icon);

        this.iconBackground.destroy();
        this.icon.destroy();

        this.iconBackground = null;
        this.icon = null;

        super.destroy();
    }
}
