import {Button, DisplayObjectFactory, LanguageText, Pivot} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {GameEvents} from "../../../../GameEvents";
import {DialogPopupData} from "./DialogPopupData";


export class DialogPopupContent extends Sprite {
    private background: NineSlicePlane;
    private promptTextBackground: NineSlicePlane;
    private title: LanguageText;
    private closeButton: Button;
    private prompt: Sprite;
    private yesButton: Button;
    private noButton: Button;

    constructor(private data: DialogPopupData) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    onOverlayClick(): void {
        this.onCancel();
    }

    onConfirm(): void {
        this.data.resolve(true);
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_DIALOG_POPUP));
    }

    onCancel(): void {
        this.data.resolve(false);
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_DIALOG_POPUP));
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("common/frame_window_2", 68, 250, 68, 250);
        this.promptTextBackground = DisplayObjectFactory.createNineSlicePlane("common/frame_window_inner", 64, 64, 64, 64);
        this.title = new LanguageText({key: this.data.titleText, fontSize: 60, fill: 0xab8e70, autoFitWidth: 800});
        this.closeButton = new Button({callback: this.onCancel.bind(this)});
        this.prompt = this.data.prompt;
        this.yesButton = new Button({
            callback: this.onConfirm.bind(this),
            textKey: this.data.yesText,
            bgTextureName: "common/ButtonGreen",
            bgCornersSize: 52,
            bgSizes: new Point(370, 75),
            fontSize: 32,
            textPosition: new Point(0, -4),
            autoFitWidth: 250
        });
        if (this.data.okButtonOnly) {
            return;
        }
        this.noButton = new Button({
            callback: this.onCancel.bind(this),
            textKey: this.data.noText,
            bgTextureName: "common/ButtonRed", bgCornersSize: 52,
            bgSizes: new Point(370, 75),
            fontSize: 32,
            textPosition: new Point(0, -4),
            autoFitWidth: 250
        });
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.promptTextBackground);
        this.addChild(this.title);
        this.addChild(this.closeButton);
        this.addChild(this.prompt);
        this.addChild(this.yesButton);
        this.data.okButtonOnly || this.addChild(this.noButton);
    }

    initChildren(): void {
        this.background.width = 960;
        this.background.height = 580;
        this.promptTextBackground.width = 800;
        this.promptTextBackground.height = 200;

        Pivot.center(this.background);
        Pivot.center(this.promptTextBackground);
        Pivot.center(this.title);
        Pivot.center(this.closeButton);
        Pivot.center(this.prompt);

        this.background.y = 30;
        this.title.y = -150;
        this.prompt.y = this.promptTextBackground.y = 20;
        this.closeButton.y = -175;
        this.closeButton.x = 360;

        this.yesButton.y = 200;
        this.yesButton.languageText.style.stroke = 0x168742;
        this.yesButton.languageText.style.strokeThickness = 6;
        this.yesButton.backgroundImage.width = Math.max(this.yesButton.languageText.width + 40, this.yesButton.backgroundImage.width);
        Pivot.center(this.yesButton.backgroundImage);

        if (this.data.okButtonOnly) {
            return;
        }

        this.yesButton.x = -this.noButton.backgroundImage.width / 2 - 20;

        this.noButton.y = 200;
        this.noButton.languageText.style.stroke = 0xca2058;
        this.noButton.languageText.style.strokeThickness = 6;
        this.noButton.backgroundImage.width = Math.max(this.noButton.languageText.width + 40, this.noButton.backgroundImage.width);
        Pivot.center(this.noButton.backgroundImage);
        this.noButton.x = this.yesButton.backgroundImage.width / 2 + 20;
    }

    destroy(): void {
        this.data = undefined;

        this.removeChild(this.background);
        this.removeChild(this.title);
        this.removeChild(this.closeButton);
        this.removeChild(this.prompt);
        this.removeChild(this.yesButton);
        this.removeChild(this.noButton);

        this.background.destroy();
        this.title.destroy();
        this.closeButton.destroy();
        this.prompt.destroy();
        this.yesButton.destroy();
        this.noButton?.destroy();

        this.background = null;
        this.title = null;
        this.closeButton = null;
        this.prompt = null;
        this.yesButton = null;
        this.noButton = null;

        super.destroy();
    }
}