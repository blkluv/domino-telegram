import {TextInput} from "pixi-textinput-v5";
import {NineSlicePlane, Point, Sprite, Text} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {Settings} from "../../../../Settings";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {InputPopupData} from "./InputPopupData";


export class InputPopupContent extends Sprite {
    private background: NineSlicePlane;
    private title: Text;
    private inputBackground: NineSlicePlane;
    private input: TextInput;
    private yesButton: Button;

    constructor(private data: InputPopupData) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        //@ts-ignore
        this.input.htmlInput.addEventListener(GameEvents.KEYDOWN_EVENT_NAME, this.onKeyboardPress.bind(this), this);
    }

    onKeyboardPress(e: KeyboardEvent) {
        //@ts-ignore
        this.input.htmlInput.removeEventListener(GameEvents.KEYDOWN_EVENT_NAME, this.onKeyboardPress.bind(this), this);
        //@ts-ignore
        this.input.htmlInput.addEventListener(GameEvents.KEYDOWN_EVENT_NAME, this.onKeyboardPress.bind(this), this);

        if (e.code == "Enter") {
            e.preventDefault();
            this.onConfirm();
        }
    }

    onOverlayClick() {
        this.onCancel();
    }

    onConfirm() {
        this.data.resolve(this.input.text.toString());
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_INPUT_POPUP));
    }

    onCancel() {
        this.data.resolve("");
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_INPUT_POPUP));
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("common/frame_window_2", 68, 250, 68, 250);
        this.title = new LanguageText({key: this.data.titleText, fontSize: 60, fill: 0xab8e70, autoFitWidth: 800});
        this.inputBackground = DisplayObjectFactory.createNineSlicePlane("friends/input_bg", 34, 34, 34, 34);
        this.input = new TextInput({
            multiline: false,
            input: {
                multiline: false,
                fontSize: "28px",
                fontFamily: Settings.COMMISSIONER,
                fontWeight: "800",
                padding: "40px",
                width: "390px",
                color: "#98855F",
                height: "0px",
                textAlign: "left",
                rows: 1
            },
        });
        this.yesButton = new Button({
            callback: this.onConfirm.bind(this),
            textKey: this.data.yesText,
            bgTextureName: "common/ButtonGreen",
            bgCornersSize: 52,
            bgSizes: new Point(420, 80),
            fontSize: 32,
            textPosition: new Point(0, -4),
            autoFitWidth: 250
        });
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.title);
        this.addChild(this.inputBackground);
        this.addChild(this.input);
        this.addChild(this.yesButton);
    }

    initChildren() {
        // @ts-ignore
        this.input.placeholder = this.data.placeholderText;
        this.input._placeholderColor = 0x98855F;
        // @ts-ignore
        this.input.text = "";
        this.input.focus();

        this.inputBackground.width = 520;
        this.inputBackground.height = 80;
        this.background.width = 820;
        this.background.height = 480;

        Pivot.center(this.input);
        Pivot.center(this.inputBackground);
        Pivot.center(this.background);
        Pivot.center(this.title);

        this.title.y = -140;
        this.input.y = this.inputBackground.y = -20;
        this.yesButton.y = 130;

        this.yesButton.languageText.style.stroke = 0x168742;
        this.yesButton.languageText.style.strokeThickness = 6;
        this.yesButton.backgroundImage.width = Math.max(this.yesButton.languageText.width + 40, this.yesButton.backgroundImage.width);
        Pivot.center(this.yesButton.backgroundImage);

    }

    destroy(): void {
        //@ts-ignore
        this.input.htmlInput.addEventListener(GameEvents.KEYDOWN_EVENT_NAME, this.onKeyboardPress.bind(this), this);
        this.data = null;

        this.removeChild(this.background);
        this.removeChild(this.title);
        this.removeChild(this.input);
        this.removeChild(this.inputBackground);
        this.removeChild(this.yesButton);

        this.background.destroy();
        this.title.destroy();
        this.input.destroy();
        this.inputBackground.destroy();
        this.yesButton.destroy();

        this.background = null;
        this.title = null;
        this.input = null;
        this.inputBackground = null;
        this.yesButton = null;

        super.destroy();
    }
}