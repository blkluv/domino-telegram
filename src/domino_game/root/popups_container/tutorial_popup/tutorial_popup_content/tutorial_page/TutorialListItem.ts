import {Sprite} from "pixi.js";
import {ScrollItem} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TutorialPageConfig, TutorialPageElementsConfig} from "./TutorialPageConfig";


export class TutorialListItem extends ScrollItem {
    background: Sprite;
    elements: Sprite[] = [];

    constructor(private data: TutorialPageConfig) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.data.elements && this.createElements();
    }

    createElements(): void {
        this.elements = this.data.elements.map((data: TutorialPageElementsConfig) => {
            this.addChild(data.element);
            data.element.x = data.position.x;
            data.element.y = data.position.y;
            return data.element;
        });
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite(this.data.imageName);
    }

    addChildren(): void {
        this.addChild(this.background);
    }

    initChildren(): void {
        this.background.scale.set(.9);
        this.x = -this.background.width / 2;
    }

    destroy(): void {
        while (this.elements.length) {
            let element: Sprite = this.elements.shift();
            this.removeChild(element);
            element.destroy();
            element = null;
        }
        this.elements = null;

        this.removeChild(this.background);
        this.background.destroy();
        this.background = null;
        super.destroy();
    }
}
