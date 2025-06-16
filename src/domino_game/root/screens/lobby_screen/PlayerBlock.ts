import {Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Player} from "../../../../common/Player";
import {DynamicData} from "../../../../DynamicData";
import {GameEvents} from "../../../../GameEvents";
import {Balance} from "./Balance";


export class PlayerBlock extends Sprite {
    private player: Player;
    private playerName: LanguageText;
    private balance: Balance;
    private settingsButton: Button;
    private onProfileUpdatedBindThis: (e: Event) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.placeSettingsButton();

        this.onProfileUpdatedBindThis = this.onProfileUpdated.bind(this);
        addEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
    }

    createChildren(): void {
        this.player = new Player({callback: this.onPlayerClick.bind(this), showLevel: true});
        this.playerName = new LanguageText({key: DynamicData.myProfile.name, fontSize: 28, align: "center", autoFitWidth: 350});
        this.balance = new Balance(this.onBalanceClick.bind(this));
        this.settingsButton = new Button({
            callback: this.onSettingsClick.bind(this),
            bgTextureName: "lobby/icon_setting",
            disabledOffline: true,
            dimWhenDisabled: true
        });
    }

    addChildren(): void {
        this.addChild(this.player);
        this.addChild(this.playerName);
        this.addChild(this.balance);
        this.addChild(this.settingsButton);
    }

    initChildren(): void {
        this.player.applyData(DynamicData.myProfile);
        this.playerName.setTextStroke(0x266390, 2, false);

        this.player.x = 100;
        this.player.y = 100;
        this.playerName.x = 200;
        this.playerName.y = 35;
        this.settingsButton.y = this.playerName.y + 18;
        this.balance.x = 310;
        this.balance.y = 112;
    }

    placeSettingsButton() {
        this.settingsButton.x = this.playerName.x + this.playerName.width + this.settingsButton.backgroundWidth / 2 + 10;

    }

    onBalanceClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_STORE_POPUP));
    }

    onPlayerClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_PROFILE_POPUP, {data: {profileData: DynamicData.myProfile}}));
    }

    onSettingsClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_SETTINGS_POPUP));
    }

    onProfileUpdated(): void {
        this.playerName.text = DynamicData.myProfile.name;
        this.placeSettingsButton();
        this.player.applyData(DynamicData.myProfile);
    }

    destroy(): void {
        removeEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
        this.onProfileUpdatedBindThis = null;

        this.removeChild(this.player);
        this.removeChild(this.playerName);
        this.removeChild(this.balance);
        this.removeChild(this.settingsButton);

        this.player.destroy();
        this.playerName.destroy();
        this.balance.destroy();
        this.settingsButton.destroy();

        this.player = null;
        this.playerName = null;
        this.balance = null;
        this.settingsButton = null;

        super.destroy();
    }
}