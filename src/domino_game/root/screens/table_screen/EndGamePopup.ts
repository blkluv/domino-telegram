import {Sine, TweenMax} from "gsap";
import {NineSlicePlane, Point, Sprite, Text} from "pixi.js";
import {DominoGame} from "../../../../app";
import {Button} from "@azur-games/pixi-vip-framework";
import {ClaimCoins} from "../../../../common/ClaimCoins";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {ScreenFilterContainer} from "@azur-games/pixi-vip-framework";
import {SocketGameRequestState} from "../../../../dynamic_data/SocketGameRequestState";
import {DynamicData} from "../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {GameMode} from "../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SocketGameConfig} from "../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {SocketService} from "../../../../services/SocketService";
import {SoundsPlayer} from "../../../../services/SoundsPlayer";
import {UserEventsService} from "../../../../services/UserEventsService";
import {StaticData} from "../../../../StaticData";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {ScreenType} from "../ScreenType";
import {EndGamePlayer} from "./end_game_pupup/EndGamePlayer";
import {EndGamePointsBlock} from "./end_game_pupup/EndGamePointsBlock";
import {EndGameScore} from "./end_game_pupup/EndGameScore";
import {EndGameSummary} from "./end_game_pupup/EndGameSummary";
import {MaskGraphics} from "./end_game_pupup/MaskGraphics";


export class EndGamePopup extends ScreenFilterContainer {
    private background: Sprite;
    private vignette: NineSlicePlane;
    private score: EndGameScore;
    private gameTypeText: LanguageText;
    private pointsBlock: EndGamePointsBlock;
    private newGameButton: Button;
    private exitButton: Button;
    private myPlayer: EndGamePlayer;
    private otherPlayer: EndGamePlayer;
    graphics: MaskGraphics = new MaskGraphics();
    private endGamSummary: EndGameSummary;
    private scoreContainer: Sprite;
    private gameTypeTextContainer: Sprite;
    private pointsBlockContainer: Sprite;
    private newGameButtonContainer: Sprite;
    private exitButtonContainer: Sprite;
    private myPlayerContainer: Sprite;
    private otherPlayerContainer: Sprite;
    private endGameSummaryContainer: Sprite;
    private claimCoins: ClaimCoins;

    constructor(private fast: boolean = false, afterRefresh: boolean = false) {
        super(true);
        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.addChild(this.graphics);
        this.onGameScaleChanged();

        this.showMask();

        this.handleSounds();
        afterRefresh || this.animateCoins();
    }

    handleSounds(): void {
        SoundsPlayer.stopMusic();
        SoundsPlayer.play(DynamicData.socketGameRequest.state == SocketGameRequestState.WON ? "win" : "lose");
    }

    async animateCoins(): Promise<void> {
        let rewardCoins: number = DynamicData.socketGameRequest.rewardCoins;
        this.enableNewGameButton(false);
        rewardCoins && await this.claimCoins.claimCoins(new Point(100, 150), rewardCoins);
        this.enableNewGameButton(true);
        UserEventsService.checkLevelUpMessage();
    }

    get newGameAvailable(): boolean {
        let gameConfig: SocketGameConfig = StaticData.gamesConfig.find(gameConfig => gameConfig.gameMode == DynamicData.socketGameRequest.mode && gameConfig.gameType == DynamicData.socketGameRequest.type);
        let nextGameCost: number = gameConfig.gameMode == GameMode.PRO ? gameConfig.bet : gameConfig.cost;
        return nextGameCost <= DynamicData.myProfile.coins;
    }

    enableNewGameButton(value: boolean) {
        this.newGameButton.enabled = value;
        this.newGameButton.brightness = value ? 1 : .5;
    }

    destroy() {

        this.removeChild(this.background);
        this.removeChild(this.vignette);

        this.removeChild(this.scoreContainer);
        this.removeChild(this.gameTypeTextContainer);
        this.removeChild(this.pointsBlockContainer);
        this.removeChild(this.newGameButtonContainer);
        this.removeChild(this.exitButtonContainer);
        this.removeChild(this.myPlayerContainer);
        this.removeChild(this.otherPlayerContainer);
        this.removeChild(this.endGameSummaryContainer);
        this.removeChild(this.claimCoins);

        this.scoreContainer.removeChild(this.score);
        this.gameTypeTextContainer.removeChild(this.gameTypeText);
        this.pointsBlockContainer.removeChild(this.pointsBlock);
        this.newGameButtonContainer.removeChild(this.newGameButton);
        this.exitButtonContainer.removeChild(this.exitButton);
        this.myPlayerContainer.removeChild(this.myPlayer);
        this.otherPlayerContainer.removeChild(this.otherPlayer);
        this.endGameSummaryContainer.removeChild(this.endGamSummary);

        this.background.destroy();
        this.vignette.destroy();

        this.score.destroy();
        this.scoreContainer.destroy();
        this.gameTypeText.destroy();
        this.gameTypeTextContainer.destroy();
        this.pointsBlock.destroy();
        this.pointsBlockContainer.destroy();
        this.newGameButton.destroy();
        this.newGameButtonContainer.destroy();
        this.exitButton.destroy();
        this.exitButtonContainer.destroy();
        this.myPlayer.destroy();
        this.myPlayerContainer.destroy();
        this.otherPlayer.destroy();
        this.otherPlayerContainer.destroy();
        this.endGamSummary.destroy();
        this.endGameSummaryContainer.destroy();
        this.claimCoins.destroy();

        this.background = undefined;
        this.vignette = undefined;
        this.score = undefined;
        this.scoreContainer = undefined;
        this.gameTypeText = undefined;
        this.gameTypeTextContainer = undefined;
        this.pointsBlock = undefined;
        this.pointsBlockContainer = undefined;
        this.newGameButton = undefined;
        this.newGameButtonContainer = undefined;
        this.exitButton = undefined;
        this.exitButtonContainer = undefined;
        this.myPlayer = undefined;
        this.myPlayerContainer = undefined;
        this.otherPlayer = undefined;
        this.otherPlayerContainer = undefined;
        this.endGamSummary = undefined;
        this.endGameSummaryContainer = undefined;
        this.claimCoins = undefined;

        this.graphics.clear();
        this.graphics.destroy();
        this.graphics = null;

        super.destroy();
    }

    onGameScaleChanged() {
        this.vignette.width = DominoGame.instance.screenW + 2;
        this.vignette.height = DominoGame.instance.screenH + 2;

        this.exitButton.x = -DominoGame.instance.screenW / 2 + 200;
        this.exitButton.y = DominoGame.instance.screenH / 2 - 200;
        this.graphics.x = -DominoGame.instance.screenW / 2;
        this.graphics.y = -DominoGame.instance.screenH / 2;

        Pivot.center(this.vignette);
        this.resizeBackckground();
    }

    private createChildren() {
        this.scoreContainer = DisplayObjectFactory.createSprite();
        this.gameTypeTextContainer = DisplayObjectFactory.createSprite();
        this.pointsBlockContainer = DisplayObjectFactory.createSprite();
        this.newGameButtonContainer = DisplayObjectFactory.createSprite();
        this.exitButtonContainer = DisplayObjectFactory.createSprite();
        this.myPlayerContainer = DisplayObjectFactory.createSprite();
        this.otherPlayerContainer = DisplayObjectFactory.createSprite();
        this.endGameSummaryContainer = DisplayObjectFactory.createSprite();
        this.background = DisplayObjectFactory.createSprite("lobby/bg");
        this.vignette = DisplayObjectFactory.createNineSlicePlane("table/black4", 1, 1, 1, 1);
        this.score = new EndGameScore();
        this.gameTypeText = new LanguageText({key: "Back/GameMode/" + DynamicData.socketGameRequest.mode.toUpperCase(), fontSize: 46, autoFitWidth: 330});
        this.pointsBlock = new EndGamePointsBlock();
        this.newGameButton = new Button({
            callback: this.onNewGameClick.bind(this),
            bgTextureName: "common/active_button",
            bgCornersSize: 20,
            bgSizes: new Point(365, 100),
            textKey: "EndGameWindow/new-game",
            fontSize: 38,
            autoFitWidth: 310,
            textPosition: new Point(0, 5)
        });
        this.exitButton = new Button({
            callback: this.onExitGameClick.bind(this),
            bgTextureName: "table/end_game/exit",
        });
        this.myPlayer = new EndGamePlayer(true, this.score.myWin);
        this.otherPlayer = new EndGamePlayer(false, !this.score.myWin);
        this.endGamSummary = new EndGameSummary();
        this.claimCoins = new ClaimCoins(DynamicData.myCoinsOnGameStart);
    }

    private addChildren() {
        this.addChild(this.background);
        this.addChild(this.vignette);

        this.addChild(this.scoreContainer);
        this.addChild(this.gameTypeTextContainer);
        this.addChild(this.pointsBlockContainer);
        this.addChild(this.endGameSummaryContainer);
        this.addChild(this.newGameButtonContainer);
        this.addChild(this.exitButtonContainer);
        this.addChild(this.myPlayerContainer);
        this.addChild(this.otherPlayerContainer);

        this.scoreContainer.addChild(this.score);
        this.gameTypeTextContainer.addChild(this.gameTypeText);
        this.pointsBlockContainer.addChild(this.pointsBlock);
        this.endGameSummaryContainer.addChild(this.endGamSummary);
        this.newGameButtonContainer.addChild(this.newGameButton);
        this.exitButtonContainer.addChild(this.exitButton);
        this.myPlayerContainer.addChild(this.myPlayer);
        this.otherPlayerContainer.addChild(this.otherPlayer);
        this.addChild(this.claimCoins);
    }

    private async onNewGameClick(): Promise<void> {
        if (this.newGameAvailable) {
            dispatchEvent(new MessageEvent(GameEvents.HIDE_END_ROUND_POPUP, {data: null}));
            SocketService.roomRepeating = true;
            SocketService.createGameRequest(DynamicData.socketGameRequest.type, DynamicData.socketGameRequest.mode);
        } else {
            await new Promise(resolve => dispatchEvent(new MessageEvent(GameEvents.SCREEN_CHANGE, {data: {screen: ScreenType.LOBBY, resolve}})));
            dispatchEvent(new MessageEvent(GameEvents.LOBBY_SELECT_GAME_MODE, {data: DynamicData.socketGameRequest.mode}));
            SocketService.tryLeave();
        }
    }

    private async onExitGameClick(): Promise<void> {
        let promises: Promise<any>[] = [
            this.exitButtonContainer,
            this.newGameButtonContainer,
            this.myPlayerContainer,
            this.otherPlayerContainer,
            this.scoreContainer,
            this.gameTypeTextContainer,
            this.pointsBlockContainer,
            this.endGameSummaryContainer
        ].map((container: Sprite, index: number) => new Promise(resolve => {
            TweenMax.to(container.scale, {duration: .3, x: 1.4, y: 1.4, delay: index * .05});
            TweenMax.to(container, {duration: .3, alpha: 0, delay: index * .05, onComplete: resolve});
        }));
        promises.push(new Promise(resolve => TweenMax.to(this.vignette, {duration: .6, alpha: 0, onComplete: resolve})));
        promises.push(new Promise(resolve => TweenMax.to(this.blurFilter, {duration: .6, blurX: 0, blurY: 0, onComplete: resolve})));
        this.background.filters = null;
        await Promise.all(promises);
        SocketService.tryLeave();
    }

    private initChildren() {
        this.vignette.alpha = .7;
        Pivot.center(this.background);
        this.background.interactive = true;
        this.score.y = -320;

        this.blurFilter.blurX = 10;
        this.blurFilter.blurY = 10;
        this.background.filters = [this.blurFilter];

        this.gameTypeText.style.fill = [0xffffff, 0xFFE8BE];
        this.gameTypeText.style.stroke = 0x5B2F16;
        this.gameTypeText.style.strokeThickness = 4;
        Pivot.center(this.gameTypeText);
        this.gameTypeText.y = -210;

        this.pointsBlock.y = -160;
        this.newGameButton.y = 350;

        this.newGameButton.languageText.setTextStroke(0x308B0F, 4);
        this.newGameButton.languageText.y = -4;

        this.myPlayer.y = this.otherPlayer.y = -300;
        this.myPlayer.x = -303;
        this.otherPlayer.x = -this.myPlayer.x;
    }

    private resizeBackckground() {
        if (DominoGame.instance.screenW / DominoGame.instance.screenH > this.background.texture.width / this.background.texture.height) {
            this.background.width = DominoGame.instance.screenW;
            this.background.scale.y = this.background.scale.x;

        } else {
            this.background.height = DominoGame.instance.screenH;
            this.background.scale.x = this.background.scale.y;
        }

        Pivot.center(this.background);
        this.graphics.resize();
    }

    private async showMask() {
        DominoGame.instance.root.interactive = DominoGame.instance.root.interactiveChildren = false;
        this.mask = this.graphics;
        await new Promise(resolve => TweenMax.to(this.graphics, {duration: this.fast ? 0 : 1.2, progress: 1, ease: Sine.easeIn, onComplete: resolve}));
        this.mask = null;
        this.removeChild(this.graphics);
        DominoGame.instance.root.interactive = DominoGame.instance.root.interactiveChildren = true;
    }
}