import {TextInput} from "pixi-textinput-v5";
import {NineSlicePlane, Sprite, Text} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../GameEvents";
import {LanguageService} from "@azur-games/pixi-vip-framework";
import {Settings} from "../../../../../Settings";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class ChatsSearchInput extends Sprite {
    private background: NineSlicePlane;
    private input: TextInput;
    private actionIcon: Sprite;
    private cancelButton: Button;

    constructor(private actionIconTexture: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        //@ts-ignore
        this.input.htmlInput.style.visibility = 'visible';
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("messages/bg_search", 30, 30, 30, 30);
        this.input = new TextInput({
            multiline: false,
            input: {
                multiline: false,
                fontSize: "24px",
                fontFamily: Settings.COMMISSIONER,
                fontWeight: "800",
                padding: "40px",
                width: "1110px",
                color: "#AE82E2",
                height: "0px",
                textAlign: "left",
                rows: 1
            },
        });
        //@ts-ignore
        this.input.htmlInput.style.visibility = 'hidden';
        this.input.on("input", this.onInput.bind(this), this);
        this.actionIcon = DisplayObjectFactory.createSprite(this.actionIconTexture);
        this.cancelButton = new Button({callback: this.cancel.bind(this), bgTextureName: "messages/icon_x"});
    }

    addChildren(): void {
        //@ts-ignore
        this.input.placeholder = LanguageService.getTextByKey("FriendWindow.enter-the-friend-name");
        this.input._placeholderColor = 0xAE82E2;
        this.addChild(this.background);
        this.addChild(this.input);
        this.addChild(this.actionIcon);
        this.addChild(this.cancelButton).visible = false;
    }

    initChildren(): void {
        this.background.width = 1257;
        this.background.height = 61;

        Pivot.center(this.background);
        Pivot.center(this.input);
        Pivot.center(this.actionIcon);
        Pivot.center(this.cancelButton);

        this.actionIcon.x = 580;
        this.cancelButton.x = 580;
        this.input.x = -40;
    }

    cancel(): void {
        //@ts-ignore
        this.input.text = "";
        this.cancelButton.visible = false;
        this.actionIcon.visible = true;
        dispatchEvent(new MessageEvent(GameEvents.ON_CHATS_SEARCH, {data: ""}));
    }

    onInput(value: string): void {
        if (value.length > 16) {
            let inputText: Text = this.input.children.find(child => child instanceof Text) as Text;
            //@ts-ignore
            this.input.text = inputText.text.substr(0, inputText.text.length - 1);
        }
        this.actionIcon.visible = !value;
        this.cancelButton.visible = !!value;
        dispatchEvent(new MessageEvent(GameEvents.ON_CHATS_SEARCH, {data: value}));
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.input);
        this.removeChild(this.actionIcon);
        this.removeChild(this.cancelButton);

        this.background.destroy();
        this.input.destroy();
        this.actionIcon.destroy();
        this.cancelButton.destroy();

        this.background = null;
        this.input = null;
        this.actionIcon = null;
        this.cancelButton = null;

        super.destroy();
    }
}
