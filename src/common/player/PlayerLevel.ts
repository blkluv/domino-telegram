import {DisplayObjectFactory, LanguageText, Pivot} from "@azur-games/pixi-vip-framework";
import {Sprite} from "pixi.js";
import {PlayerData} from "../../services/socket_service/socket_message_data/profile_data/PlayerData";
import {PlayerLevelProgress} from "./player_level/PlayerLevelProgress";


export class PlayerLevel extends Sprite {
    private playerData: PlayerData;
    private background: Sprite;
    private levelText: LanguageText;
    private levelProgress: PlayerLevelProgress;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("profile/player_level_bg");
        this.levelText = new LanguageText({key: "1", fontSize: 30, autoFitWidth: 40, fontWeight: "700"});
        this.levelProgress = new PlayerLevelProgress();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.levelText);
        this.addChild(this.levelProgress).createInnerCircleMask(78);
    }

    initChildren(): void {
        this.levelText.setTextStroke(0x145380, 4);

        Pivot.center(this.background);

        this.levelText.y = -3;
    }

    applyData(playerData: PlayerData): void {
        this.visible = !!playerData?.level;
        if (!playerData) {
            return;
        }
        this.playerData = playerData;
        this.levelText.changeText(this.playerData.level.toString());
        this.levelProgress.applyPlayerData(playerData);
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.levelText);

        this.background.destroy();
        this.levelText.destroy();

        this.background = null;
        this.levelText = null;

        super.destroy();
    }

}