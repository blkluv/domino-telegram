import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextCaseFormat} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class PopupBody extends Sprite {
    private header: Sprite;
    private background: NineSlicePlane;
    private titleText: LanguageText;
    private closeButton: Button;
    backButton: Button;

    constructor(private onClose: Function, private titleTextKey: string, private onBackButtonClick: Function = null, private bgSizes: Point = new Point(1200, 700)) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.interactive = this.interactiveChildren = true;
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("common/frame_window", 54, 112, 56, 54);
        this.header = DisplayObjectFactory.createSprite("common/header_art");
        this.titleText = new LanguageText({key: this.titleTextKey, fontSize: 65, fill: 0xffffff, centerAfterLanguageChanged: true, textFormat: TextCaseFormat.UPPERCASE});
        this.closeButton = new Button({callback: this.onClose, bgTextureName: "common/button_close"});
        this.onBackButtonClick && (this.backButton = new Button({callback: this.onBackButtonClick, bgTextureName: "common/back_button"}));
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.header);
        this.addChild(this.titleText);
        this.addChild(this.closeButton);
        this.backButton && this.addChild(this.backButton);
    }

    initChildren(): void {
        this.y = 70;

        this.titleText.setTextStroke(0x9F755A, 10);

        this.background.width = this.bgSizes.x;
        this.background.height = this.bgSizes.y;

        Pivot.center(this.background);
        Pivot.center(this.header);
        Pivot.center(this.titleText);

        this.header.y = -this.background.height / 2 + 20;
        this.titleText.y = this.closeButton.y = this.header.y - 10;
        this.closeButton.x = this.background.width / 100 * 42.3;

        if (this.backButton) {
            this.backButton.y = this.header.y;
            this.backButton.x = -this.background.width / 100 * 42.3;
        }
    }

    showBackButton(value: boolean): void {
        this.backButton.visible = value;
    }

    destroy(): void {
        this.removeChild(this.header);
        this.removeChild(this.background);
        this.removeChild(this.titleText);
        this.removeChild(this.closeButton);

        this.header.destroy();
        this.background.destroy();
        this.titleText.destroy();
        this.closeButton.destroy();

        this.header = null;
        this.background = null;
        this.titleText = null;
        this.closeButton = null;

        if (this.backButton) {
            this.removeChild(this.backButton);
            this.backButton.destroy();
            this.backButton = null;
        }

        super.destroy();
    }
}
