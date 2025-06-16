import {Sprite} from "pixi.js";
import {SettingsService} from "../../../../../../services/SettingsService";
import {SettingsRoundButton} from "./settings_round_buttons/SettingsRoundButton";


export class SettingsRoundButtons extends Sprite {
    private musicButton: SettingsRoundButton;
    private soundButton: SettingsRoundButton;
    private micButton: SettingsRoundButton;
    private vibrationButton: SettingsRoundButton;
    containerWidth: number = 750;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {

        this.musicButton = new SettingsRoundButton(this.onMusicButtonClick.bind(this), "settings/music", SettingsService.musicIsOn);
        this.soundButton = new SettingsRoundButton(this.onSoundButtonClick.bind(this), "settings/sound", SettingsService.soundIsOn);
        this.micButton = new SettingsRoundButton(null, "settings/mic", false);
        this.vibrationButton = new SettingsRoundButton(null, "settings/vibration", false);

    }

    addChildren(): void {
        this.addChild(this.musicButton);
        this.addChild(this.soundButton);
        this.addChild(this.micButton);
        this.addChild(this.vibrationButton);
    }

    initChildren(): void {
        this.soundButton.x = 250;
        this.micButton.x = 500;
        this.vibrationButton.x = 750;
    }

    onMusicButtonClick(): void {
        SettingsService.musicIsOn = !SettingsService.musicIsOn;
        this.musicButton.activate(SettingsService.musicIsOn);
    };

    onSoundButtonClick(): void {
        SettingsService.soundIsOn = !SettingsService.soundIsOn;
        this.soundButton.activate(SettingsService.soundIsOn);
    }

    destroy(): void {
        this.removeChild(this.musicButton);
        this.removeChild(this.soundButton);
        this.removeChild(this.vibrationButton);
        this.removeChild(this.micButton);

        this.musicButton.destroy();
        this.soundButton.destroy();
        this.vibrationButton.destroy();
        this.micButton.destroy();

        this.musicButton = null;
        this.soundButton = null;
        this.vibrationButton = null;
        this.micButton = null;

        super.destroy();
    }
}
