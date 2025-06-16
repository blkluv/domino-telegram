import {Button, DisplayObjectFactory, Pivot, LanguageService} from "@azur-games/pixi-vip-framework";
import {TextInput} from "pixi-textinput-v5";
import {NineSlicePlane, Sprite, Text} from "pixi.js";
import {GameEvents} from "../../../../../../GameEvents";
import {Settings} from "../../../../../../Settings";
import {PlatformUtils} from "../../../../../../utils/PlatformUtils";
import {InviteFBFriendButton} from "../friends_share_page/share_container/InviteFBFriendButton";


export class FindFriendsInput extends Sprite {
    private maxInputLength: number = 16;
    private inputCooldownTime: number = 1000;
    private cooldownTimeoutId: number;
    private inputBackground: NineSlicePlane;
    private input: TextInput;
    private searchingGlassButton: Button;
    private cancelButton: Button;
    private inviteFBButton: InviteFBFriendButton;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
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
        this.input.on("input", this.tryToInput.bind(this), this);
        this.searchingGlassButton = new Button({callback: this.onSearchButtonClick.bind(this), bgTextureName: "friends/searching_glass_static"});
        this.cancelButton = new Button({callback: this.cancel.bind(this), bgTextureName: "friends/icon_delete_brown"});
        this.inviteFBButton = new InviteFBFriendButton();
    }

    addChildren(): void {
        this.addChild(this.inputBackground);
        this.addChild(this.input);
        this.addChild(this.searchingGlassButton);
        this.addChild(this.cancelButton).visible = false;
        this.addChild(this.inviteFBButton).visible = false;
    }

    initChildren(): void {
        this.inputBackground.width = 520;
        this.inputBackground.height = 80;
        //@ts-ignore
        this.input.placeholder = LanguageService.getTextByKey("FriendWindow.enter-the-friend-name");
        this.input._placeholderColor = 0x98855F;
        PlatformUtils.desktopPlatform() && this.input.focus();

        Pivot.center(this.input);
        Pivot.center(this.inputBackground);

        this.searchingGlassButton.x = this.cancelButton.x = 210;
        this.input.x = -35;
        this.inviteFBButton.x = 460;
    }

    tryToInput(value: string): void {
        if (value.length > this.maxInputLength) {
            let inputText = this.input.children.find(child => child instanceof Text) as Text;
            //@ts-ignore
            this.input.text = inputText.text.substr(0, value.length - 1);
        }
        this.searchingGlassButton.visible = !value;
        this.cancelButton.visible = !!value;
        window.clearTimeout(this.cooldownTimeoutId);
        this.cooldownTimeoutId = window.setTimeout(this.onInput.bind(this), this.inputCooldownTime);
    }

    onInput(): void {
        dispatchEvent(new MessageEvent(GameEvents.ON_FRIENDS_SEARCH, {data: this.input.text}));
    }

    cancel(): void {
        //@ts-ignore
        this.input.text = "";
        this.cancelButton.visible = false;
        this.searchingGlassButton.visible = true;
        dispatchEvent(new MessageEvent(GameEvents.ON_FRIENDS_SEARCH, {data: ""}));
    }

    onSearchButtonClick(): void {
        //@ts-ignore
        this.tryToInput(this.input.text);
    }

    destroy(): void {
        window.clearTimeout(this.cooldownTimeoutId);

        this.removeChild(this.inputBackground);
        this.removeChild(this.input);
        this.removeChild(this.searchingGlassButton);
        this.removeChild(this.cancelButton);
        this.removeChild(this.inviteFBButton);

        this.inputBackground.destroy();
        this.input.destroy();
        this.searchingGlassButton.destroy();
        this.cancelButton.destroy();
        this.inviteFBButton.destroy();

        this.inputBackground = null;
        this.input = null;
        this.searchingGlassButton = null;
        this.cancelButton = null;
        this.inviteFBButton = null;

        super.destroy();
    }
}
