import {TextInput} from "pixi-textinput-v5";
import {NineSlicePlane, Sprite, Text} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../GameEvents";
import {LanguageService} from "@azur-games/pixi-vip-framework";
import {SocketService} from "../../../../../../services/SocketService";
import {Settings} from "../../../../../../Settings";
import {Clamp} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Timeout} from "@azur-games/pixi-vip-framework";


export class MessageInput extends Sprite {
    private background: NineSlicePlane;
    private input: TextInput;
    private sendButton: Button;
    private userID: number;
    private enabled: boolean = true;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        //@ts-ignore
        this.input.htmlInput.addEventListener(GameEvents.KEYDOWN_EVENT_NAME, this.onKeyboardPress.bind(this), this);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("messages/bg_search", 30, 30, 30, 30);
        this.input = new TextInput({
            input: {
                fontSize: "24px",
                fontFamily: Settings.COMMISSIONER,
                fontWeight: "800",
                width: "1100px",
                color: "#AE82E2",
                textAlign: "left",
                multiline: true,
                height: "68px",
            }
        });

        this.sendButton = new Button({callback: this.onSend.bind(this), bgTextureName: "messages/icon_send"});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.input);
        this.addChild(this.sendButton);
    }

    initChildren(): void {
        //@ts-ignore
        this.input.placeholder = LanguageService.getTextByKey("ChatWindow/conversion/input-placeholder");
        this.input._placeholderColor = 0xAE82E2;

        this.background.width = 1257;
        this.background.height = 81;

        Pivot.center(this.background);
        Pivot.center(this.input);
        Pivot.center(this.sendButton);

        this.sendButton.x = 580;
        this.input.x = -40;
        this.input.y = 20;
    }

    onKeyboardPress(e: KeyboardEvent) {
        //@ts-ignore
        this.input.htmlInput.removeEventListener(GameEvents.KEYDOWN_EVENT_NAME, this.onKeyboardPress.bind(this), this);
        //@ts-ignore
        this.input.htmlInput.addEventListener(GameEvents.KEYDOWN_EVENT_NAME, this.onKeyboardPress.bind(this), this);

        if (e.code == "Enter" && !e.shiftKey) {
            e.preventDefault();
            this.onSend();
        } else {
            this.onInput();
        }
    }

    onInput(): void {
        let inputText: Text = this.input.children.find(child => child instanceof Text) as Text;
        this.background.height = Clamp.between(81, inputText.height + 40, 120);
        this.sendButton.y = this.background.height / 2 - (this.sendButton.backgroundHeight / 2 + 24);
        dispatchEvent(new MessageEvent(GameEvents.ON_CHAT_INPUT, {data: this.background.height}));
    }

    setUserID(id: number): void {
        this.userID = id;
    }

    onSend(): void {
        if (!this.input.text.toString() || !this.enabled) {
            return;
        }
        SocketService.sendUserMessage(this.userID, this.input.text.toString());
        this.clearInput();
        this.cooldownInput();
    }

    async cooldownInput(): Promise<void> {
        this.enabled = false;
        this.sendButton.brightness = .7;
        await Timeout.seconds(1);
        this.enabled = true;
        this.sendButton.brightness = 1;
    }

    clearInput(): void {
        //@ts-ignore
        this.input.text = "";
        this.onInput();
    }

    destroy(): void {
        //@ts-ignore
        this.input.htmlInput.addEventListener(GameEvents.KEYDOWN_EVENT_NAME, this.onKeyboardPress.bind(this), this);

        this.removeChild(this.background);
        this.removeChild(this.input);
        this.removeChild(this.sendButton);

        this.background.destroy();
        this.input.destroy();
        this.sendButton.destroy();

        this.background = null;
        this.input = null;
        this.sendButton = null;

        super.destroy();
    }
}
