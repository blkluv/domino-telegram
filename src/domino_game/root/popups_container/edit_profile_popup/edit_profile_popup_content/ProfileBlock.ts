import {Button, DisplayObjectFactory, LanguageService, Pivot, PlatformService} from "@azur-games/pixi-vip-framework";
import {TweenMax} from "gsap";
import {TextInput} from "pixi-textinput-v5";
import {NineSlicePlane, Point, Rectangle, Sprite, Text} from "pixi.js";
import {Player} from "../../../../../common/Player";
import {ShineParticles} from "../../../../../common/ShineParticles";
import {DynamicData} from "../../../../../DynamicData";
import {GameEvents} from "../../../../../GameEvents";
import {AvatarService} from "../../../../../services/AvatarService";
import {SocketError} from "../../../../../services/socket_service/SocketError";
import {SocketService} from "../../../../../services/SocketService";
import {Settings} from "../../../../../Settings";
import {PlatformUtils} from "../../../../../utils/PlatformUtils";
import {EditProfileError} from "./profile_block/EditProfileError";


export class ProfileBlock extends Sprite {
    private chosenAvatar: string = AvatarService.getAvatarTextureNameByProfile(DynamicData.myProfile);
    private player: Player;
    private shineParticles: ShineParticles;
    private nameInput: TextInput;
    private saveButton: Button;
    private onAvatarChooseBindThis: (e: MessageEvent) => void;
    private brightnessTween: TweenMax;
    private nameInputText: Text;
    private nameInputBackground: NineSlicePlane;
    private error: EditProfileError;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.placeInput();

        this.onAvatarChooseBindThis = this.onAvatarChoose.bind(this);
        addEventListener(GameEvents.CHOOSE_AVATAR, this.onAvatarChooseBindThis);
        //@ts-ignore
        this.nameInput.htmlInput.style.visibility = 'visible';
    }

    get avatarHasChanged(): boolean {
        return this.chosenAvatar != AvatarService.getAvatarTextureNameByProfile(DynamicData.myProfile);
    }

    get nameHasChanged(): boolean {
        return this.nameInput.text.toString() != DynamicData.myProfile.name;
    }

    createChildren(): void {
        this.player = new Player({showLevel: false});
        let dotsBox = new Rectangle(0, 0, 300, 400);
        this.shineParticles = new ShineParticles("edit_profile/dot", 5, dotsBox, .8);
        this.saveButton = new Button({
            callback: this.onSave.bind(this),
            bgTextureName: "common/active_button",
            bgCornersSize: 21,
            bgSizes: new Point(230, 80),
            textKey: "SAVE",
            fontSize: 45,
            textPosition: new Point(0, -4),
            autoFitWidth: 200
        });
        this.nameInput = new TextInput({
            input: {
                multiline: false,
                fontSize: "40px",
                fontFamily: Settings.COMMISSIONER,
                fontWeight: "800",
                width: "320px",
                color: "#FFFFFF",
                height: "60px",
                textAlign: "left",
                rows: 1,
            },
        });
        //@ts-ignore
        this.nameInput.htmlInput.style.visibility = 'hidden';
        this.error = new EditProfileError();
        this.nameInput.on("input", this.onInput.bind(this), this);
        this.nameInputText = this.nameInput.children.find(child => child instanceof Text) as Text;
        this.nameInputBackground = DisplayObjectFactory.createNineSlicePlane("edit_profile/avatar_bg", 45, 45, 45, 45);
    }

    addChildren(): void {
        this.addChild(this.shineParticles);
        this.addChild(this.player);
        this.addChild(this.nameInput);
        this.addChild(this.saveButton);
        this.addChild(this.nameInputBackground).alpha = .7;
        this.addChild(this.error);
    }

    initChildren(): void {
        this.nameInputBackground.height = 70;

        this.player.applyData(DynamicData.myProfile);
        this.player.scale.set(1.5);

        this.saveButton.languageText.setTextStroke(0x308B0F, 6);
        this.saveButton.brightness = .7;
        this.saveButton.enabled = false;

        // @ts-ignore
        this.nameInput.text = DynamicData.myProfile.name;
        // @ts-ignore
        this.nameInput.placeholder = LanguageService.getTextByKey("Enter a new name");
        this.nameInput._placeholderColor = 0xFFFFFF;
        PlatformUtils.desktopPlatform() && this.nameInput.focus();
        //@ts-ignore
        this.nameInput.disabled = !PlatformService.platformApi.myPlayerNameEditable;

        this.shineParticles.x = -150;
        this.shineParticles.y = -360;
        this.nameInput.y = 57;
        this.nameInputBackground.y = 90;
        this.saveButton.y = 200;
        this.player.y = -145;
        this.error.y = 320;
    }

    onInput(value: string): void {
        if (value.length > 15) {
            let inputText: Text = this.nameInput.children.find(child => child instanceof Text) as Text;
            //@ts-ignore
            this.nameInput.text = inputText.text.substr(0, inputText.text.length - 1);
        }
        this.placeInput();
        this.tryToEnableSaveButton();
        this.error.show(false);
    }

    placeInput(): void {
        this.nameInput.x = -this.nameInputText.width / 2;
        this.placeInputBackground();
    }

    placeInputBackground(): void {
        this.nameInputBackground.width = Math.max(440, this.nameInputText.width + 60);
        Pivot.center(this.nameInputBackground);
    }

    async onSave(): Promise<void> {
        this.error.show(false);
        try {
            await this.setName();
            await this.setAvatar();
            dispatchEvent(new MessageEvent(GameEvents.CLOSE_EDIT_PROFILE_POPUP));
        } catch (err) {
            this.setError(err);
        }
    }

    async setAvatar(): Promise<void> {
        await SocketService.setPlayerIcon(AvatarService.getIconByTextureName(this.chosenAvatar));
    }

    async setName(): Promise<void> {
        await SocketService.setPlayerName(this.nameInput.text.toString());
    }

    setError(err: string): void {
        let errorsDictionary: {[key: string]: string} = {
            [SocketError.ALREADY_EXISTS]: "ProfileSetNameWindow.already-exists",
            [SocketError.TOO_SHORT]: "ProfileSetNameWindow.too-short",
            [SocketError.TOO_LONG]: "ProfileSetNameWindow.too-long"
        };
        this.error.changeText(errorsDictionary[err]);
        this.error.show(true);
    }

    tryToEnableSaveButton(): void {
        let changesWasMade: boolean = this.avatarHasChanged || this.nameHasChanged;
        this.saveButton.enabled = changesWasMade;

        this.brightnessTween?.kill();
        this.brightnessTween = TweenMax.to(this.saveButton, .4, {brightness: changesWasMade ? 1 : .7});
    }

    onAvatarChoose(e: MessageEvent): void {
        let avatar: string = e.data;
        this.chosenAvatar = avatar;
        this.player.setAvatar(avatar);
        this.tryToEnableSaveButton();
    }

    destroy(): void {
        this.nameInput.off("input", this.onInput, this);

        removeEventListener(GameEvents.CHOOSE_AVATAR, this.onAvatarChooseBindThis);
        this.onAvatarChooseBindThis = null;

        this.brightnessTween?.kill();
        this.brightnessTween = null;

        this.removeChild(this.player);
        this.removeChild(this.shineParticles);
        this.removeChild(this.nameInput);
        this.removeChild(this.saveButton);
        this.removeChild(this.error);

        this.player.destroy();
        this.shineParticles.destroy();
        this.nameInput.destroy();
        this.saveButton.destroy();
        this.error.destroy();

        this.player = null;
        this.shineParticles = null;
        this.nameInput = null;
        this.saveButton = null;
        this.error = null;

        super.destroy();
    }

}
