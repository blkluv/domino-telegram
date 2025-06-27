import {DisplayObjectFactory, LanguageText, NumberUtils, Pivot, ScrollItem, GameType, Button} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Point, Sprite, Text} from "pixi.js";
import {DynamicData} from "../../../../../../DynamicData";
import {SocketGameConfig} from "../../../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {SocketService} from "../../../../../../services/SocketService";


export class RoomsListItem extends ScrollItem {
    private typeToColor: Partial<Record<GameType, string>> = {
        [GameType.HARD1]: "green",
        [GameType.HARD2]: "blue",
        [GameType.HARD3]: "green",
        [GameType.HARD4]: "orange"
    };

    private available: boolean;
    private background: NineSlicePlane;
    private leftColorBar: NineSlicePlane;
    private betLabel: LanguageText;
    private betAmount: LanguageText;
    private divider: NineSlicePlane;
    private playersIcon: Sprite;
    private playersCount: Text;
    private sitButton: Button;

    constructor(private gameConfig: SocketGameConfig) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.updateButtonState();
        this.cache(true);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("lobby/room_bg", 46, 46, 46, 46);
        this.leftColorBar = DisplayObjectFactory.createNineSlicePlane(`lobby/green_bar`, 35, 28, 3, 30);
        this.betLabel = new LanguageText({key: "Bet", fontSize: 28, fontWeight: "400"});
        this.betAmount = new LanguageText({key: `$${NumberUtils.coinsKiloFormat(this.gameConfig.bet || this.gameConfig.cost || 0)}`, fontSize: 48,});
        this.divider = DisplayObjectFactory.createNineSlicePlane("lobby/room_item_divider", 1, 5, 1, 5);
        this.playersIcon = DisplayObjectFactory.createSprite("common/profiles");
        this.playersCount = new LanguageText({key: `${this.gameConfig.minPlayers}/${this.gameConfig.maxPlayers}`, fontSize: 36});
        this.sitButton = new Button({
            callback: this.onSitButtonClick.bind(this),
            bgTextureName: "common/green_button",
            bgSizes: new Point(203, 96),
            bgCornersSize: 34,
            textKey: "Sit",
            fontSize: 50,
            fontWeight: "500",
        });
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.leftColorBar);
        this.addChild(this.betLabel);
        this.addChild(this.betAmount);
        this.addChild(this.divider);
        this.addChild(this.playersIcon);
        this.addChild(this.playersCount);
        this.addChild(this.sitButton);
    }

    initChildren(): void {
        this.background.width = 960;
        this.background.height = 190;
        this.leftColorBar.width = 52;
        this.leftColorBar.height = 170;
        this.divider.height = 138;

        Pivot.center(this.background);
        Pivot.center(this.leftColorBar);
        Pivot.center(this.divider);
        Pivot.center(this.playersIcon);
        Pivot.center(this.playersCount, false);

        this.background.y = 4;
        this.leftColorBar.x = -445;
        this.betLabel.x = -390;
        this.betLabel.y = -45;
        this.betAmount.x = -390;
        this.betAmount.y = -10;
        this.divider.x = -130;
        this.playersIcon.x = -80;
        this.playersCount.x = -20;
        this.sitButton.x = 320;
        this.sitButton.backgroundImage.y = 7;
    }

    private updateButtonState(): void {
        this.available = this.gameConfig.minLevel <= DynamicData.myProfile.level && this.gameConfig.minBalanceCoins <= DynamicData.myProfile.coins;
        this.alpha = this.available ? 1 : 0.2;
        this.sitButton.enabled = this.available;
    }

    private onSitButtonClick(): void {
        if (this.dragged || !this.available) {
            return;
        }
        SocketService.createGameRequest(this.gameConfig.gameType, this.gameConfig.gameMode);
    }

    cache(value: boolean): void {
        this.background.cacheAsBitmap = value;
        this.betLabel.cacheAsBitmap = value;
        this.betAmount.cacheAsBitmap = value;
        this.playersIcon.cacheAsBitmap = value;
        this.playersCount.cacheAsBitmap = value;
        this.sitButton.cacheAsBitmap = value;
    }

    destroy(): void {
        this.cache(false);

        this.removeChild(this.background);
        this.removeChild(this.leftColorBar);
        this.removeChild(this.betLabel);
        this.removeChild(this.betAmount);
        this.removeChild(this.playersIcon);
        this.removeChild(this.playersCount);
        this.removeChild(this.sitButton);

        this.background.destroy();
        this.leftColorBar.destroy();
        this.betLabel.destroy();
        this.betAmount.destroy();
        this.playersIcon.destroy();
        this.playersCount.destroy();
        this.sitButton.destroy();

        this.background = null;
        this.leftColorBar = null;
        this.betLabel = null;
        this.betAmount = null;
        this.playersIcon = null;
        this.playersCount = null;
        this.sitButton = null;

        super.destroy();
    }
} 