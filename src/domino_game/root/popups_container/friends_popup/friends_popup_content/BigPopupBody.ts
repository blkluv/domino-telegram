import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextCaseFormat} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class BigPopupBody extends Sprite {
    defaultBackgroundSize: Point = new Point(1384, 720);
    background: NineSlicePlane;
    private header: Sprite;
    private closeButton: Button;
    private titleText: LanguageText;

    constructor(private onClose: Function, private titleTextKey: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.interactive = this.interactiveChildren = true;
    }

    createChildren(): void {
        this.header = DisplayObjectFactory.createSprite("common/header_art_long");
        this.closeButton = new Button({callback: this.onClose, bgTextureName: "common/button_close"});
        this.titleText = new LanguageText({key: this.titleTextKey, fontSize: 64, fill: 0xffffff, textFormat: TextCaseFormat.UPPERCASE});
        this.background = DisplayObjectFactory.createNineSlicePlane("common/bg_violet", 48, 48, 48, 48);
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.header);
        this.addChild(this.closeButton);
        this.addChild(this.titleText);
    }

    initChildren(): void {
        this.titleText.setTextStroke(0x9F755A, 10);

        this.background.width = this.defaultBackgroundSize.x;
        this.background.height = this.defaultBackgroundSize.y;

        Pivot.center(this.background);
        Pivot.center(this.header);
        Pivot.center(this.titleText);

        this.header.y = -this.background.height / 2;
        this.closeButton.x = this.header.width / 100 * 41.78;
        this.closeButton.y = this.header.y - 10;
        this.titleText.y = this.closeButton.y;
    }

    changeTitle(key: string): void {
        this.titleText.changeText(key);
    }

    destroy(): void {
        this.removeChild(this.header);
        this.removeChild(this.closeButton);
        this.removeChild(this.background);
        this.removeChild(this.titleText);

        this.header.destroy();
        this.closeButton.destroy();
        this.background.destroy();
        this.titleText.destroy();

        this.header = null;
        this.closeButton = null;
        this.background = null;
        this.titleText = null;

        super.destroy();
    }
}
