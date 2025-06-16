import {GiftConfig, ItemsService, LanguageService, Timeout, WindowFocusController} from "@azur-games/pixi-vip-framework";
import {DiffPatcher} from "jsondiffpatch";
import * as jsonPatchFormatter from "jsondiffpatch/formatters/jsonpatch";
import {Sprite3D} from "pixi3d";
import {GameStateData, GameStateEvents} from "../../../data/active_data/GameStateData";
import {ActiveData} from "../../../data/ActiveData";
import {ChatMessageType} from "../../../dynamic_data/game_message/ChatMessageType";
import {GameMessage} from "../../../dynamic_data/GameMessage";
import {GamePhase} from "../../../dynamic_data/GamePhase";
import {ISocketGameState} from "../../../dynamic_data/ISocketGameState";
import {PhraseMsg} from "../../../dynamic_data/PhraseMsg";
import {SitPlace} from "../../../dynamic_data/SitPlace";
import {SocketPhrase} from "../../../dynamic_data/SocketPhrase";
import {SocketQueueData} from "../../../dynamic_data/SocketQueueData";
import {DynamicData} from "../../../DynamicData";
import {GameEvents} from "../../../GameEvents";
import {GameMode} from "../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SocketMessageType} from "../../../services/socket_service/SocketMessageType";
import {SocketService} from "../../../services/SocketService";
import {SoundsPlayer} from "../../../services/SoundsPlayer";
import {UserEventsService} from "../../../services/UserEventsService";
import {StaticData} from "../../../StaticData";
import {BaseScreen} from "./BaseScreen";
import {ScreenType} from "./ScreenType";
import {AfkOverlay} from "./table_screen/AfkOverlay";
import {Bazar} from "./table_screen/Bazar";
import {ClothInscription} from "./table_screen/ClothInscription";
import {DominoesTable} from "./table_screen/DominoesTable";
import {EndGamePopup} from "./table_screen/EndGamePopup";
import {GiftsPanel} from "./table_screen/GiftsPanel";
import {Menu} from "./table_screen/Menu";
import {ModeIndicator} from "./table_screen/ModeIndicator";
import {Sit} from "./table_screen/Sit";
import {Sits} from "./table_screen/Sits";
import {LabelColor} from "./table_screen/state_labels/StateLabel";
import {StateLabels} from "./table_screen/StateLabels";
import {TableBackground} from "./table_screen/TableBackground";
import {TableBackgroundType} from "./table_screen/TableBackroundType";
import {TableChat} from "./table_screen/TableChat";
import {TableLoader} from "./table_screen/TableLoader";


export class TableScreen extends BaseScreen {
    private background: TableBackground;
    sits: Sits;

    private loader: TableLoader;
    private clothInscription: ClothInscription;
    private onGameStateUpdateBindThis: (e: MessageEvent) => void;
    bazar: Bazar;
    private onHideEndRoundPopupBindThis: (e: MessageEvent) => void;
    private dataInProcess: boolean;
    private queue: SocketQueueData[] = [];
    private giftsQueue: SocketQueueData[] = [];
    private gameStartedInThisSession: boolean;
    private modeIndicator: ModeIndicator;
    dominoesTable: DominoesTable;
    private menu: Menu;
    private afkOverlay: AfkOverlay;
    private onDominoFromBazarBindThis: (e: MessageEvent) => void;
    private onTargetReachedBindThis: (e: MessageEvent) => void;
    private onSpinnerBindThis: (e: MessageEvent) => void;
    private onDominoBindThis: (e: MessageEvent) => void;
    stateLabels: StateLabels;
    private endGamePopup: EndGamePopup;
    private gameStateData: GameStateData;
    private onOpponentFoundBindThis: (e: MessageEvent) => void;
    private giftsPanel: GiftsPanel;
    private roundEnded: boolean = false;
    private dragContainer: Sprite3D;
    private dragContainerInner: Sprite3D;
    private stateTime: number;
    private onCloseMenuAndBazarBindThis: (e: MessageEvent) => void;
    private chat: TableChat;

    constructor() {
        super(ScreenType.TABLE);

        this.onGameStateUpdateBindThis = this.onGameStateUpdate.bind(this);
        addEventListener(GameEvents.GAME_STATE_UPDATE, this.onGameStateUpdateBindThis);

        this.onHideEndRoundPopupBindThis = this.onHideEndRoundPopup.bind(this);
        addEventListener(GameEvents.HIDE_END_ROUND_POPUP, this.onHideEndRoundPopupBindThis);

        this.onDominoFromBazarBindThis = this.onDominoFromBazar.bind(this);
        addEventListener(GameEvents.DOMINO_FROM_BAZAR, this.onDominoFromBazarBindThis);

        this.onTargetReachedBindThis = this.onTargetReached.bind(this);
        addEventListener(GameEvents.TARGET_REACHED, this.onTargetReachedBindThis);

        this.onSpinnerBindThis = this.onSpinner.bind(this);
        addEventListener(GameEvents.SPINNER, this.onSpinnerBindThis);

        this.onDominoBindThis = this.onDomino.bind(this);
        addEventListener(GameEvents.DOMINO, this.onDominoBindThis);

        this.onOpponentFoundBindThis = this.onOpponentFound.bind(this);
        addEventListener(GameEvents.OPPONENT_FOUND, this.onOpponentFoundBindThis);

        this.onCloseMenuAndBazarBindThis = this.onCloseMenuAndBazar.bind(this);
        addEventListener(GameEvents.CLOSE_MENU_AND_BAZAR, this.onCloseMenuAndBazarBindThis);

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.interactive = this.interactiveChildren = true;

        this.onGameScaleChanged();
        this.showLoader(true);
    }

    onCloseMenuAndBazar(): void {
        this.menu.openMenu(false);
        this.dominoesTable.showBazar(false);
    }

    async onGameStateUpdateProcess(socketGameState: ISocketGameState, fast: boolean): Promise<void> {
        if (ActiveData.gameStateData) {
            ActiveData.applyJsonPatchArray(jsonPatchFormatter.format((new DiffPatcher).diff(DynamicData.socketGameState, socketGameState)));
        } else {
            this.clearTable();
            DynamicData.socketGameState = socketGameState;
            ActiveData.createClasses(socketGameState);
            this.setGameStateData();
        }
        switch (socketGameState.phase) {
            case GamePhase.DISTRIBUTION:
                await this.dominoesTable.clear();
                this.sits.resetPointsSoundIndexes();
                await this.dominoesTable.dealing();
                this.setRoundEndedFalse();
                break;
            case GamePhase.PLAYING:
                this.dominoesTable.inHandReposition(true);
                this.dominoesTable.setClickableDominoes();
                await this.dominoesTable.movePlayedPieces(true);
                this.setRoundEndedFalse();
                this.chat.enableButtons(true);
                break;
            case GamePhase.END:
                this.showResultWindow();
                //SocketService.closeGameConnection();
                break;
        }
    }

    onGameScaleChanged(e?: MessageEvent): void {
        this.dominoesTable.resize();
    }

    destroy(): void {
        removeEventListener(GameEvents.GAME_STATE_UPDATE, this.onGameStateUpdateBindThis);
        this.onGameStateUpdateBindThis = undefined;

        removeEventListener(GameEvents.HIDE_END_ROUND_POPUP, this.onHideEndRoundPopupBindThis);
        this.onHideEndRoundPopupBindThis = undefined;

        removeEventListener(GameEvents.DOMINO_FROM_BAZAR, this.onDominoFromBazarBindThis);
        this.onDominoFromBazarBindThis = undefined;

        removeEventListener(GameEvents.TARGET_REACHED, this.onTargetReachedBindThis);
        this.onTargetReachedBindThis = undefined;

        removeEventListener(GameEvents.SPINNER, this.onSpinnerBindThis);
        this.onSpinnerBindThis = undefined;

        removeEventListener(GameEvents.DOMINO, this.onDominoBindThis);
        this.onDominoBindThis = undefined;

        removeEventListener(GameEvents.OPPONENT_FOUND, this.onOpponentFoundBindThis);
        this.onOpponentFoundBindThis = undefined;

        removeEventListener(GameEvents.CLOSE_MENU_AND_BAZAR, this.onCloseMenuAndBazarBindThis);
        this.onCloseMenuAndBazarBindThis = undefined;

        this.removeGameStateListeners();

        this.gameStateData = undefined;

        ActiveData.gameStateData = null;
        DynamicData.socketGameState = null;

        this.queue.length = 0;
        this.queue = undefined;

        this.tryHideResultWindow();

        this.removeChild(this.background);
        this.removeChild(this.loader);
        this.removeChild(this.clothInscription);
        this.removeChild(this.modeIndicator);
        this.removeChild(this.dominoesTable);
        this.removeChild(this.sits);
        this.removeChild(this.menu);
        this.removeChild(this.bazar);
        this.removeChild(this.stateLabels);
        this.removeChild(this.giftsPanel);
        this.removeChild(this.dragContainer);
        this.dragContainer.removeChild(this.dragContainerInner);

        this.background.destroy();
        this.loader.destroy();
        this.clothInscription.destroy();
        this.modeIndicator.destroy();
        this.dominoesTable.destroy();
        this.sits.destroy();
        this.menu.destroy();
        this.bazar.destroy();
        this.stateLabels.destroy();
        this.giftsPanel.destroy();
        this.dragContainer.destroy();
        this.dragContainerInner.destroy();

        this.background = undefined;
        this.loader = undefined;
        this.clothInscription = undefined;
        this.modeIndicator = undefined;
        this.dominoesTable = undefined;
        this.sits = undefined;
        this.menu = undefined;
        this.bazar = undefined;
        this.stateLabels = undefined;
        this.giftsPanel = undefined;
        this.dragContainer = undefined;
        this.dragContainerInner = undefined;

        super.destroy();
    }

    onHideEndRoundPopup() {
        this.tryHideResultWindow();
        this.clearTable();
    }

    async onGameMessageUpdateProcess(messageData: GameMessage, fast: boolean): Promise<void> {
        let recipientSit: Sit = this.sits.getSitById(messageData.recipientId);
        let senderSit: Sit = this.sits.getSitById(messageData.senderId);
        switch (messageData.kind) {
            case ChatMessageType.GIFT:
                let giftConfig: GiftConfig = ItemsService.getGiftById(messageData.body);
                fast ? recipientSit.showGiftIdle(giftConfig) : recipientSit.showGift(giftConfig);
                break;
            case ChatMessageType.TEXT:
                if (!senderSit) {
                    debugger;
                }
                senderSit.bubble.showText(LanguageService.getTextByKey("text-chat.message." + messageData.body.split(":")[1]));
                break;
            case ChatMessageType.SMILE:
                senderSit.bubble.showSmile(messageData.body);
                break;
        }
    }

    private initChildren() {
        this.stateLabels.y = 0;
    }

    showLoader(show: boolean) {
        this.loader.visible = show;
        this.clothInscription.visible = !show;
    }

    private async onGameStateUpdate(e: {data: SocketQueueData}) {
        if (this.queue.length || this.dataInProcess) {
            this.queue.push(e.data);
        } else {
            this.nextData(e.data);
        }
    }

    private async nextData(data: SocketQueueData): Promise<void> {
        this.dataInProcess = true;
        switch (data.messageType) {
            case SocketMessageType.STATE:
                this.stateTime = Date.now();
                let socketGameState: ISocketGameState = data.messageData as ISocketGameState;
                if (socketGameState.phase == GamePhase.DISTRIBUTION || socketGameState.phase == null) {
                    this.gameStartedInThisSession = true;
                }
                let fast: boolean = data.fast || !this.gameStartedInThisSession;
                this.gameStartedInThisSession = true;
                await this.onGameStateUpdateProcess(socketGameState, fast);
                break;
            case SocketMessageType.PHRASE:
                await this.onPhraseUpdateProcess(data.messageData as SocketPhrase, data.messagePlace);
                break;
            case SocketMessageType.GAME_MESSAGE:
                await this.onGameMessageUpdateProcess(data.messageData as GameMessage, Date.now() - this.stateTime < 1000);
                break;

        }

        this.dataInProcess = false;
        this.queue?.length && this.nextData(this.queue.shift());
        this.giftsQueue?.length && this.nextData(this.giftsQueue.shift());
    }

    async showResultWindow(afterRefresh: boolean = false): Promise<void> {
        if (this.endGamePopup) {
            return;
        }
        this.onCloseMenuAndBazar();
        this.endGamePopup = new EndGamePopup(WindowFocusController.recentlyFocused || !WindowFocusController.focused, afterRefresh);
        this.addChild(this.endGamePopup);
        this.afkOverlay.show(false);
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_LEAVE_GAME_POPUP));
        this.giftsPanel.show(false);
        this.sits.exitTimer();
        if (!this.gameStateData) {
            return;
        }
        this.gameStateData.turn = SitPlace.NONE;
        this.gameStateData.timerDurationMillis = 0;
    }

    tryHideResultWindow(): void {
        this.removeChild(this.endGamePopup);
        this.endGamePopup?.destroy();
        this.endGamePopup = undefined;
    }

    private createChildren() {
        this.background = new TableBackground(TableBackgroundType.DEFAULT);
        this.loader = new TableLoader();
        this.clothInscription = new ClothInscription();
        this.modeIndicator = new ModeIndicator(DynamicData.socketGameRequest.mode);
        this.dragContainer = new Sprite3D();
        this.dragContainerInner = new Sprite3D();
        this.dominoesTable = new DominoesTable(this.dragContainer, this.dragContainerInner);
        this.sits = new Sits();
        this.menu = new Menu();
        this.bazar = new Bazar();
        this.giftsPanel = new GiftsPanel();
        this.afkOverlay = new AfkOverlay();
        this.stateLabels = new StateLabels();
        this.chat = new TableChat();
    }

    private onDominoFromBazar(): void {
        this.bazar.jump();
    }

    async lowCoins() {
        await this.stateLabels.createLabel(LabelColor.BLUE, "TableMessages/LowCoins");
    }

    async highCoins() {
        await this.stateLabels.createLabel(LabelColor.BLUE, "TableMessages/HighCoins");
    }

    async afk() {
        await this.stateLabels.createLabel(LabelColor.BLUE, "TableMessages/AFK");
    }

    private onDomino(e: MessageEvent): void {
        DynamicData.socketGameRequest.mode == GameMode.PRO || SoundsPlayer.play("finalDomino");
        let sit: Sit = this.sits.getSitBySitPlace(e.data as SitPlace);
        sit.bubble.showImg();
    }

    private onOpponentFound(): void {
        this.showLoader(false);
    }

    private addChildren() {
        this.addChild(this.background);
        this.addChild(this.loader);
        this.addChild(this.clothInscription);
        this.addChild(this.modeIndicator);
        this.addChild(this.dominoesTable);
        this.addChild(this.bazar);
        this.addChild(this.stateLabels);
        this.addChild(this.sits);
        this.addChild(this.menu);
        this.addChild(this.giftsPanel).visible = false;
        this.addChild(this.chat);
        this.addChild(this.afkOverlay);
        this.addChild(this.dragContainer);
        this.dragContainer.addChild(this.dragContainerInner);
    }

    private onTargetReached(e: MessageEvent): void {
        this.stateLabels.createLabel(LabelColor.BLUE, "TableMessages/TargetReached");
    }

    private setGameStateData() {
        this.removeGameStateListeners();

        this.gameStateData = ActiveData.gameStateData;

        this.gameStateData.addListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);
        this.gameStateData.addListener(GameStateEvents.TAKING_UNUSED_CHANGED, this.onTakingUnusedChanged, this);
        this.gameStateData.addListener(GameStateEvents.TIMER_END_DELAY_MILLIS_CHANGED, this.onTimerEndDelayMillisChanged, this);

        this.sits.setGameStateData(ActiveData.gameStateData);
        this.dominoesTable.setGameStateData(ActiveData.gameStateData);
        this.modeIndicator.setGameStateData(ActiveData.gameStateData);
        this.bazar.setGameStateData(ActiveData.gameStateData);
        this.afkOverlay.setGameStateData(ActiveData.gameStateData);

        this.onTakingUnusedChanged(this.gameStateData.takingUnused);
    }

    private async onTakingUnusedChanged(takingUnused: boolean): Promise<void> {
        if (this.dominoesTable.dominoPlayInProgress && takingUnused) {
            await new Promise(resolve => this.dominoesTable.dominoPlayCompleteResolve = resolve);
        }
        if (!this.gameStateData.takingUnused) {
            this.dominoesTable.showBazar(false);
            return;
        }
        takingUnused && this.bazar.redraw();
        if (this.gameStateData.turn == SitPlace.BOTTOM) {
            await Timeout.seconds(.5);
        } else {
            this.dominoesTable.setMyDominoesVisible(false);
        }
        this.dominoesTable.showBazar(takingUnused);
    };

    private onSpinner(e: MessageEvent): void {
        SoundsPlayer.play("finalDomino");
        this.stateLabels.createLabel(LabelColor.ORANGE, "TableMessages/Spinner", true);
    }

    private clearTable() {
        this.sits.clear();
        this.sits.hideWinner();
        this.dominoesTable.clear();
        this.showLoader(true);
        this.modeIndicator.reset();
    }

    private async onPhraseUpdateProcess(messageData: SocketPhrase, messagePlace: SitPlace) {
        let sit: Sit = this.sits.getSitBySitPlace(messagePlace);
        switch (messageData.msg) {
            case PhraseMsg.PASS:
                sit.sayPass();
                break;
            case PhraseMsg.WIN:
                this.roundEnded = true;
                messageData.factor > 1 && await this.stateLabels.createLabel(LabelColor.DARK, "TableMessages/Factor" + messageData.factor);
                DynamicData.kingMode && sit.showWinner();
                break;
            case PhraseMsg.DEAD_END:
                sit.sayPass();
                await this.stateLabels.createLabel(LabelColor.DARK, "TableMessages/Factor1");
                this.sits.roundEndedWithDeadEnd = true;
                break;
            case PhraseMsg.FIRST:
                await this.stateLabels.createLabel(LabelColor.BLUE, "TableMessages/" + (messagePlace == SitPlace.BOTTOM ? "YouStart" : "OpponentStarts"));
                break;
            case PhraseMsg.FINE:
            case PhraseMsg.REWARD:
                if (!WindowFocusController.documentVisible) {
                    break;
                }
                let sit1: Sit = this.sits.getSitBySitPlace(messagePlace);
                let sit2: Sit = this.sits.getSitById(messageData.targetUserId);
                if (!sit2) {
                    debugger
                }
                let plotnost: number = .5;
                let coinsCount: number = 15;
                let currentCoinSum: number = messageData.coins / coinsCount;
                let totalNumber: number = sit2.roundUserData.coins += messageData.coins;
                let promise: Promise<void> = new Promise<void>(async resolve => {
                    SoundsPlayer.play("fallingCoins");
                    for (let i = 0; i < 5; i++) {
                        this.sits?.flyCoin(sit1, sit2, false, currentCoinSum);
                        await Timeout.milliseconds(30 / plotnost + Math.random() * 5);
                        if (this.destroyed) {
                            break;
                        }
                        this.sits?.flyCoin(sit1, sit2, false, currentCoinSum);
                        await Timeout.milliseconds(30 / plotnost + Math.random() * 5);
                        if (this.destroyed) {
                            break;
                        }
                        this.sits?.flyCoin(sit1, sit2, i == 4, currentCoinSum, messageData.coins, totalNumber);
                        await Timeout.milliseconds(30 / plotnost + Math.random() * 5);
                        if (this.destroyed) {
                            break;
                        }
                    }
                    resolve();
                });
                if (!this.roundEnded) {
                    await promise;
                }
                break;
        }
    }

    private async onPhaseChanged(phase: GamePhase): Promise<void> {
        phase && this.showLoader(false);
        this.chat.enableButtons(phase == GamePhase.PLAYING);
        switch (phase) {
            case GamePhase.DISTRIBUTION:
                DynamicData.myCoinsOnGameStart = DynamicData.myProfile.coins;
                await this.dominoesTable.dealing();
                this.sits.resetPointsSoundIndexes();
                this.sits.hideWinner();
                this.sits.clearAbsentVals();
                this.setRoundEndedFalse();
                this.sits.updateCoins();
                break;
            case GamePhase.SCORING:
                let targetScore: number = StaticData.getCurrentGameConfig().targetScore;
                let targetReached: boolean = this.gameStateData.playersSlots.asArray().some(playerData => playerData.moveScore >= targetScore);
                (DynamicData.socketGameRequest.mode == GameMode.FIVES && targetReached) || await this.dominoesTable.showHandsDominoes();
                (DynamicData.socketGameRequest.mode == GameMode.PRO || targetReached) || await this.classicScoring();
                break;
            case GamePhase.END:
                DynamicData.socketGameRequest.mode == GameMode.PRO
                    ? UserEventsService.checkLevelUpMessage()
                    : SocketService.closeGameConnection();
                break;
        }

    }

    private onTimerEndDelayMillisChanged(): void {
        if (this.dominoesTable.dominoPlayInProgress) {
            return;
        }
        this.gameStateData.takingUnused && this.bazar.redraw();
    }

    private removeGameStateListeners() {
        this.gameStateData?.removeListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);
        this.gameStateData?.removeListener(GameStateEvents.TAKING_UNUSED_CHANGED, this.onTakingUnusedChanged, this);
        this.gameStateData?.removeListener(GameStateEvents.TIMER_END_DELAY_MILLIS_CHANGED, this.onTimerEndDelayMillisChanged, this);
    }

    private async classicScoring() {
        let topScore: number = this.gameStateData.playersSlots.top.winScore;
        let bottomScore: number = this.gameStateData.playersSlots.bottom.winScore;
        await Promise.all([
            new Promise<void>(async resolve => {
                await Timeout.seconds(1.5);
                if (topScore == bottomScore) {
                    this.stateLabels.createLabel(LabelColor.BLUE, "TableMessages/RoundDraw");
                } else if (topScore > bottomScore) {
                    this.stateLabels.createLabel(LabelColor.RED, "TableMessages/RoundLost");
                    this.sits.getSitBySitPlace(SitPlace.TOP).showWinner(true);
                } else {
                    this.stateLabels.createLabel(LabelColor.ORANGE, "TableMessages/RoundWon");
                    this.sits.getSitBySitPlace(SitPlace.BOTTOM).showWinner(true);
                }
                resolve();
            }),
            this.sits.scoring(topScore, bottomScore)
        ]);
    }

    private setRoundEndedFalse() {
        this.sits.roundEndedWithDeadEnd = false;
        this.roundEnded = false;
    }
}