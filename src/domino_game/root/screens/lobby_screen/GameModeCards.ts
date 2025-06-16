import {Back, Linear, TweenMax} from "gsap";
import {DisplayObject, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../DynamicData";
import {LobbySpineName} from "../../../../factories/spine_factory/LobbySpineName";
import {SpineFactory} from "../../../../factories/SpineFactory";
import {GameEvents} from "../../../../GameEvents";
import {GameMode} from "../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {GameType} from "../../../../services/socket_service/socket_message_data/socket_game_config/GameType";
import {SocketGameConfig} from "../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {SocketService} from "../../../../services/SocketService";
import {StaticData} from "../../../../StaticData";
import {GameModeCard} from "./game_cards/GameModeCard";
import {BackButton} from "./game_mode_cards/BackButton";
import {GameModeIndicator} from "./game_mode_cards/GameModeIndicator";
import {InnerRoomCard} from "./game_mode_cards/InnerRoomCard";


export class GameModeCards extends Sprite {
    private girlSpine: DisplayObject;
    private gameModeCards: GameModeCard[];
    private marginBetweenItems: number = 30;
    private _containerWidth: number;
    private pageIndex: number = 0;
    private pageLength: number = 3;
    private innerRoomCards: InnerRoomCard[] = [];
    private backButton: Button;
    private currentGameMode: GameMode;
    private arrowLeft: Button;
    private arrowRight: Button;
    private modeIndicator: GameModeIndicator;
    private innerCenter: number = 980;
    private onSelectGameModeBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onSelectGameModeBindThis = this.onSelectGameMode.bind(this);
        addEventListener(GameEvents.LOBBY_SELECT_GAME_MODE, this.onSelectGameModeBindThis);
    }

    getItems(): Button[] {
        return this.gameModeCards;
    }

    getGirl(): Sprite {
        return this.girlSpine as Sprite;
    }

    get containerWidth(): number {
        return this._containerWidth * this.scale.x;
    }

    createChildren(): void {
        this.girlSpine = SpineFactory.createLobbyGirl();
        this.gameModeCards = [
            new GameModeCard(
                this.enterGameMode.bind(this),
                "lobby/classic_mod",
                LobbySpineName.CLASSIC_MODE,
                GameMode.CLASSIC
            ),
            new GameModeCard(
                this.enterGameMode.bind(this),
                "lobby/block_mod",
                LobbySpineName.BLOCK_MODE,
                GameMode.BLOCK
            ),
            new GameModeCard(
                this.enterGameMode.bind(this),
                "lobby/fives_mod",
                LobbySpineName.FIVES_MODE,
                GameMode.FIVES
            ),
            new GameModeCard(
                this.enterGameMode.bind(this),
                "lobby/king_mod",
                LobbySpineName.KING_MODE,
                GameMode.PRO
            )
        ];
        this.backButton = new BackButton({callback: this.onClickBack.bind(this), bgTextureName: "lobby/icon_back", bgCornersSize: [50, 0, 32, 0]});
        this.arrowRight = new Button({callback: this.onClickArrowRight.bind(this), bgTextureName: "lobby/arrow"});
        this.arrowLeft = new Button({callback: this.onClickArrowLeft.bind(this), bgTextureName: "lobby/arrow"});
        this.modeIndicator = new GameModeIndicator();
    }

    addChildren(): void {
        this.addChild(this.girlSpine);
        this.gameModeCards.forEach(card => this.addChild(card));
        this.addChild(this.backButton);
        this.addChild(this.arrowRight);
        this.addChild(this.arrowLeft);
        this.addChild(this.modeIndicator);
    }

    initChildren(): void {
        this.girlSpine.scale.set(.7);
        this.girlSpine.x = -100;

        this.arrowLeft.scale.x = -1;
        this.arrowLeft.y = this.arrowRight.y = 90;
        this.arrowLeft.x = this.innerCenter - 620;
        this.arrowRight.x = this.innerCenter + 620;

        this.backButton.x = 430;
        this.backButton.y = -270;

        this.modeIndicator.x = this.innerCenter;
        this.modeIndicator.y = -270;

        this.backButton.visible = false;
        this.arrowLeft.visible = false;
        this.arrowRight.visible = false;
        this.modeIndicator.visible = false;

        this.gameModeCards.forEach((card: GameModeCard, index: number) => {
            this._containerWidth = card.x = card.backgroundWidth * (index + .5) + this.marginBetweenItems * (index + 1) + 255;
        });
    }

    async onClickArrowRight(): Promise<void> {
        this.pageIndex = 1 - this.pageIndex;
        await this.drawRooms(this.currentGameMode, this.pageIndex, false, true);
    }

    async onClickArrowLeft(): Promise<void> {
        this.pageIndex = 1 - this.pageIndex;
        this.drawRooms(this.currentGameMode, this.pageIndex, false, false);
    }

    onSpecialOfferClick() {
        // dispatchEvent(new MessageEvent(GameEvents.SCREEN_CHANGE, {data: {screen: ScreenType.TABLE}}));
    }

    onClassicModeButtonClick(): void {
        SocketService.createGameRequest(GameType.ENDLESS1, GameMode.CLASSIC);
    }

    onBlockModeButtonClick(): void {
        SocketService.createGameRequest(GameType.ENDLESS1, GameMode.BLOCK);
    }

    onFivesModeButtonClick(): void {
        SocketService.createGameRequest(GameType.ENDLESS1, GameMode.FIVES);
    }

    onKingModeButtonClick(): void {
        SocketService.createGameRequest(GameType.ENDLESS1, GameMode.PRO);
    }

    async onSelectGameMode(e: MessageEvent) {
        let gameMode: GameMode = e.data;
        this.enterGameMode(gameMode);
        this.gameModeCards.forEach(card => card.visible = false);
    }

    setPage(gameMode: GameMode): void {
        let availableRooms: SocketGameConfig[] = StaticData.gamesConfig.filter(config =>
            config.gameMode == gameMode
            && DynamicData.myProfile.level >= config.minLevel
            && DynamicData.myProfile.coins >= (gameMode == GameMode.PRO ? config.minBalanceCoins : config.cost)
        );
        this.pageIndex = Math.floor(Math.max(0, availableRooms.length - 1) / this.pageLength);
    }

    private async enterGameMode(gameMode: GameMode): Promise<void> {
        this.setPage(gameMode);
        this.currentGameMode = gameMode;
        await this.showModeCards(false);
        this.drawRooms(gameMode, this.pageIndex);
    }

    async showModeCards(value: boolean): Promise<void> {
        this.gameModeCards.forEach(gameModeCard => gameModeCard.enabled = value);
        let gameModeCardsPromises: Promise<any>[] = this.gameModeCards.map((object: DisplayObject, index: number) => Promise.all([
            new Promise(resolve => TweenMax.to(object, {
                duration: .1,
                alpha: value ? 1 : 0,
                delay: index * .03,
                onComplete: resolve
            })),
            new Promise(resolve => TweenMax.to(object.scale, {
                duration: .1,
                x: value ? 1 : .3,
                y: value ? 1 : .3,
                delay: index * .03,
                ease: Back.easeIn,
                onComplete: resolve
            }))
        ]));
        await Promise.all(gameModeCardsPromises);
    }

    private async drawRooms(gameMode: GameMode, pageIndex: number, animateControls: boolean = true, toRight: boolean = true) {
        await this.clearRooms(animateControls, toRight);
        this.modeIndicator.setData(this.currentGameMode, pageIndex);
        this.enableArrows(pageIndex);

        let gameModeConfigs: SocketGameConfig[] = StaticData.gamesConfig.filter(config => config.gameMode == gameMode);
        let pageConfigs: SocketGameConfig[] = gameModeConfigs.filter((config: SocketGameConfig, index: number) => index >= pageIndex * this.pageLength && index < (pageIndex + 1) * this.pageLength);
        this.innerRoomCards = pageConfigs.map(config => new InnerRoomCard(config));
        this.innerRoomCards.forEach((roomCard: InnerRoomCard, index: number) => {
            roomCard.alpha = 0;
            roomCard.y = 90;
            roomCard.pivot.x = toRight ? -100 : 100;
            roomCard.x = this.innerCenter + (index - 1) * 390;
            this.addChild(roomCard);
            TweenMax.to(roomCard, {duration: .05, alpha: 1, delay: index * .03});
            TweenMax.to(roomCard.pivot, {duration: .05, alpha: 1, x: 0, delay: index * .03});
        });

        if (animateControls) {
            this.modeIndicator.alpha = this.arrowRight.alpha = this.arrowLeft.alpha = this.backButton.alpha = 0;
            this.backButton.scale.set(0);
            this.arrowRight.pivot.x = -50;
            this.arrowLeft.pivot.x = -50;
            this.modeIndicator.pivot.y = 54;
            this.modeIndicator.visible = this.arrowRight.visible = this.arrowLeft.visible = this.backButton.visible = true;
            await Promise.all([
                new Promise<void>(resolve => TweenMax.to(this.backButton.scale, {duration: .1, x: 1, y: 1, ease: Back.easeOut, onComplete: resolve})),
                new Promise<void>(resolve => TweenMax.to(this.backButton, {duration: .1, alpha: 1, ease: Linear.easeNone, onComplete: resolve})),
                new Promise<void>(resolve => TweenMax.to(this.arrowLeft.pivot, {duration: .1, x: 0, ease: Back.easeOut, onComplete: resolve})),
                new Promise<void>(resolve => TweenMax.to(this.arrowLeft, {duration: .1, alpha: 1, ease: Linear.easeNone, onComplete: resolve})),
                new Promise<void>(resolve => TweenMax.to(this.arrowRight.pivot, {duration: .1, x: 0, ease: Back.easeOut, onComplete: resolve})),
                new Promise<void>(resolve => TweenMax.to(this.arrowRight, {duration: .1, alpha: 1, ease: Linear.easeNone, onComplete: resolve})),
                new Promise<void>(resolve => TweenMax.to(this.modeIndicator.pivot, {duration: .1, y: 4, ease: Back.easeOut, onComplete: resolve})),
                new Promise<void>(resolve => TweenMax.to(this.modeIndicator, {duration: .1, alpha: 1, ease: Linear.easeNone, onComplete: resolve})),
            ]);
        }
    }

    private async clearRooms(animateControls: boolean = true, toRight: boolean = true): Promise<void> {
        let promises: Promise<any>[] = this.innerRoomCards.map((roomCard: InnerRoomCard, index: number) => Promise.all([
            new Promise<void>(resolve => TweenMax.to(roomCard.pivot, {
                duration: .05,
                x: toRight ? 100 : -100,
                delay: index * .03,
                onComplete: () => {
                    resolve();
                }
            })),
            new Promise<void>(resolve => TweenMax.to(roomCard, {
                duration: .05,
                alpha: 0,
                delay: index * .03,
                onComplete: () => {
                    this.removeChild(roomCard);
                    roomCard.destroy();
                    resolve();
                }
            }))
        ]));
        if (this.backButton.visible && animateControls) {
            promises.push(new Promise<void>(resolve => TweenMax.to(this.backButton.scale, {duration: .1, x: 0, y: 0, ease: Back.easeIn, onComplete: resolve})));
            promises.push(new Promise<void>(resolve => TweenMax.to(this.backButton, {duration: .1, alpha: 0, ease: Linear.easeNone, onComplete: resolve})));
            promises.push(new Promise<void>(resolve => TweenMax.to(this.arrowRight.pivot, {duration: .1, x: -50, ease: Back.easeIn, onComplete: resolve})));
            promises.push(new Promise<void>(resolve => TweenMax.to(this.arrowRight, {duration: .1, alpha: 0, ease: Linear.easeNone, onComplete: resolve})));
            promises.push(new Promise<void>(resolve => TweenMax.to(this.arrowLeft.pivot, {duration: .1, x: -50, ease: Back.easeIn, onComplete: resolve})));
            promises.push(new Promise<void>(resolve => TweenMax.to(this.arrowLeft, {duration: .1, alpha: 0, ease: Linear.easeNone, onComplete: resolve})));
            promises.push(new Promise<void>(resolve => TweenMax.to(this.modeIndicator.pivot, {duration: .1, y: 54, ease: Back.easeIn, onComplete: resolve})));
            promises.push(new Promise<void>(resolve => TweenMax.to(this.modeIndicator, {duration: .1, alpha: 0, ease: Linear.easeNone, onComplete: resolve})));
        }
        await Promise.all(promises);
        if (this.backButton.visible && animateControls) {
            this.backButton.visible = false;
            this.arrowRight.visible = false;
            this.arrowLeft.visible = false;
            this.modeIndicator.visible = false;
        }
        this.innerRoomCards = [];
    }

    private async onClickBack(): Promise<void> {
        await this.clearRooms(true, false);
        this.gameModeCards.forEach(card => card.visible = true);
        this.showModeCards(true);
    }

    private enableArrows(pageIndex: number): void {
        this.arrowLeft.brightness = pageIndex ? 1 : .7;
        this.arrowLeft.enabled = !!pageIndex;
        this.arrowRight.brightness = pageIndex ? .7 : 1;
        this.arrowRight.enabled = !pageIndex;
    }

    destroy(): void {
        removeEventListener(GameEvents.LOBBY_SELECT_GAME_MODE, this.onSelectGameModeBindThis);
        this.onSelectGameModeBindThis = null;

        //@ts-ignore
        this.girlSpine.state.timeScale = 0;

        this.removeChild(this.backButton);
        this.removeChild(this.arrowLeft);
        this.removeChild(this.arrowRight);
        this.removeChild(this.modeIndicator);
        this.removeChild(this.girlSpine);

        this.backButton.destroy();
        this.arrowLeft.destroy();
        this.arrowRight.destroy();
        this.modeIndicator.destroy();
        this.girlSpine.destroy();

        this.backButton = null;
        this.arrowLeft = null;
        this.arrowRight = null;
        this.modeIndicator = null;
        this.girlSpine = null;

        let card: GameModeCard;
        while (this.gameModeCards.length) {
            card = this.gameModeCards.shift();
            this.removeChild(card);
            card.destroy();
        }
        this.gameModeCards = null;

        super.destroy();
    }
}