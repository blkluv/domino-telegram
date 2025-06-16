import {Linear, TweenMax} from "gsap";
import {Spine} from "pixi-spine";
import {Graphics, NineSlicePlane, Sprite, Text} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {PieceDataEvent} from "../../../../data/active_data/game_state/PieceData";
import {RoundUserData, RoundUserDataEvent} from "../../../../data/active_data/game_state/players_data/RoundUserData";
import {GameStateData, GameStateEvents} from "../../../../data/active_data/GameStateData";
import {ActiveData} from "../../../../data/ActiveData";
import {GamePhase} from "../../../../dynamic_data/GamePhase";
import {UserState} from "../../../../dynamic_data/IRoundUser";
import {PiecePlace} from "../../../../dynamic_data/PiecePlace";
import {SitPlace} from "../../../../dynamic_data/SitPlace";
import {DynamicData} from "../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GraphicsFactory} from "@azur-games/pixi-vip-framework";
import {SpineFactory} from "../../../../factories/SpineFactory";
import {TextFactory} from "../../../../factories/TextFactory";
import {GameEvents} from "../../../../GameEvents";
import {AvatarService} from "../../../../services/AvatarService";
import {GiftConfig} from "@azur-games/pixi-vip-framework";
import {LanguageService} from "@azur-games/pixi-vip-framework";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {PlayerData} from "../../../../services/socket_service/socket_message_data/profile_data/PlayerData";
import {ProfileData} from "../../../../services/socket_service/socket_message_data/ProfileData";
import {GameMode} from "../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SoundsPlayer} from "../../../../services/SoundsPlayer";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Timeout} from "@azur-games/pixi-vip-framework";
import {StaticData} from "../../../../StaticData";
import {PlayerScore} from "./end_game_pupup/end_game_player/PlayerScore";
import {WinnerLabel} from "./end_game_pupup/end_game_player/winner_glow/WinnerLabel";
import {AbsentVals} from "./sit/AbsentVals";
import {Bubble} from "./sit/Bubble";
import {DealerButton} from "./sit/DealerButton";
import {DominosLeft} from "./sit/DominosLeft";
import {SitMoney} from "./sit/SitMoney";
import {TimerRound} from "./sit/TimerRound";


export class Sit extends Sprite {
    scoreIndex: number = 0;
    private avatar: Sprite;
    private avatarMask: Graphics;
    private scaleContainer: Sprite;
    private avaContainer: Button;
    private scaleTween: TweenMax;
    private avaFrame: NineSlicePlane;
    private timerRound: TimerRound;
    private dominosLeft: DominosLeft;
    absentVals: AbsentVals;
    private giftButton: Button;
    private giftSpine: Spine;
    private giftIdleSpine: Spine;
    dealerButton: DealerButton;
    money: SitMoney;
    bubble: Bubble;
    private nameText: Text;
    private avatarSize: number = 140;
    private onTurnChangedBindThis: (e: MessageEvent) => void;
    private onFocusChangedBindThis: (e: MessageEvent) => void;
    private onProfileUpdatedBindThis: (e: MessageEvent) => void;
    playerScore: PlayerScore;
    gameStateData: GameStateData;
    roundUserData: RoundUserData;
    avatarTextureName: string;
    winnerLabel: WinnerLabel;
    leavingIcon: Sprite;
    private magnate: Sprite;
    private bankrupt: Sprite;
    private specIcon: Sprite;
    private afkIcon: Sprite;

    constructor(public sitPlace: SitPlace) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.visible = DynamicData.socketGameRequest.mode == GameMode.PRO || [SitPlace.TOP, SitPlace.BOTTOM].includes(this.sitPlace);
        this.initMyUserData();

        this.onFocusChangedBindThis = this.onFocusChanged.bind(this);
        addEventListener(GameEvents.FOCUS_CHANGED, this.onFocusChangedBindThis);
        this.onProfileUpdatedBindThis = this.onProfileUpdated.bind(this);
        addEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
    }

    destroy() {
        removeEventListener(GameEvents.FOCUS_CHANGED, this.onFocusChangedBindThis);
        this.onFocusChangedBindThis = undefined;
        removeEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
        this.onProfileUpdatedBindThis = undefined;

        this.clearGameStateData();
        removeEventListener(GameEvents.DOMINO_PLAYED, this.onTurnChangedBindThis);
        this.onTurnChangedBindThis = undefined;
        this.clearRoundUserData();

        this.sitPlace = undefined;

        this.removeChild(this.scaleContainer);
        this.scaleContainer.removeChild(this.avaContainer);
        this.scaleContainer.removeChild(this.specIcon);
        this.scaleContainer.removeChild(this.afkIcon);
        this.scaleContainer.removeChild(this.avaFrame);
        this.scaleContainer.removeChild(this.timerRound);
        this.scaleContainer.removeChild(this.dominosLeft);
        this.removeChild(this.absentVals);
        this.scaleContainer.removeChild(this.dealerButton);
        this.avaContainer.removeChild(this.avatar);
        this.avaContainer.removeChild(this.avatarMask);
        this.avaContainer.removeChild(this.giftIdleSpine);
        this.removeChild(this.bubble);
        this.removeChild(this.money);
        this.removeChild(this.nameText);
        this.removeChild(this.playerScore);
        this.removeChild(this.giftButton);
        this.removeChild(this.giftSpine);
        this.removeChild(this.magnate);
        this.removeChild(this.bankrupt);
        this.removeChild(this.leavingIcon);

        this.scaleContainer.destroy();
        this.avaContainer.destroy();
        this.avatar.destroy();
        this.avatarMask.destroy();
        this.avaFrame.destroy();
        this.timerRound.destroy();
        this.dominosLeft.destroy();
        this.absentVals.destroy();
        this.bubble.destroy();
        this.money.destroy();
        this.nameText.destroy();
        this.dealerButton.destroy();
        this.playerScore.destroy();
        this.giftButton.destroy();
        this.giftSpine.destroy();
        this.giftIdleSpine.destroy();
        this.magnate.destroy();
        this.bankrupt.destroy();
        this.leavingIcon.destroy();
        this.specIcon.destroy();
        this.afkIcon.destroy();

        this.scaleContainer = undefined;
        this.avaContainer = undefined;
        this.avatar = undefined;
        this.avatarMask = undefined;
        this.avaFrame = undefined;
        this.timerRound = undefined;
        this.dominosLeft = undefined;
        this.absentVals = undefined;
        this.bubble = undefined;
        this.money = undefined;
        this.nameText = undefined;
        this.dealerButton = undefined;
        this.playerScore = undefined;
        this.giftButton = undefined;
        this.giftSpine = undefined;
        this.giftIdleSpine = undefined;
        this.magnate = undefined;
        this.bankrupt = undefined;
        this.leavingIcon = undefined;
        this.specIcon = undefined;
        this.afkIcon = undefined;

        super.destroy();
    }

    setData(gameStateData: GameStateData, roundUserData: RoundUserData) {
        this.gameStateData?.removeListener(GameStateEvents.TIMER_END_DELAY_MILLIS_CHANGED, this.updateTimer, this);
        this.gameStateData?.pieces.classes.forEach(pieceData => pieceData.removeListener(PieceDataEvent.PLACE_CHANGED, this.onPiecePlaceChanged, this));

        this.gameStateData = gameStateData;
        this.gameStateData.addListener(GameStateEvents.TIMER_END_DELAY_MILLIS_CHANGED, this.updateTimer, this);
        this.updateTimer();

        this.gameStateData.addListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);

        this.onTurnChangedBindThis && removeEventListener(GameEvents.DOMINO_PLAYED, this.onTurnChangedBindThis);
        this.onTurnChangedBindThis = this.onTurnChanged.bind(this);
        addEventListener(GameEvents.DOMINO_PLAYED, this.onTurnChangedBindThis);
        this.onTurnChanged();

        this.gameStateData.pieces.classes.forEach(pieceData => pieceData.addListener(PieceDataEvent.PLACE_CHANGED, this.onPiecePlaceChanged, this));
        this.setRoundUserData(roundUserData);
    }

    initMyUserData(): void {
        if (this.sitPlace != SitPlace.BOTTOM) {
            return;
        }
        this.setName(DynamicData.myProfile.name);
        this.onIconChanged();
        this.onCoinsChanged(DynamicData.myProfile.coins);
    }

    onTurnChanged(): void {
        this.dominosLeft.setValue(ActiveData.gameStateData?.pieces?.classes.filter(pieceData => pieceData.place == PiecePlace.WORKSET && pieceData.side == this.sitPlace)?.length || 0);
    }

    setRoundUserData(roundUserData: RoundUserData) {
        this.clearRoundUserData();
        if (!roundUserData) {
            this.exitTimer();
            this.setScale(.9);
            this.setName("");
            this.playerScore.setValue(0);
            this.money.setValue(0);
            this.dominosLeft.setValue(0);
            this.absentVals.update([]);
            this.initMyUserData();
            this.giftButton.visible = false;
            this.giftIdleSpine.state.setEmptyAnimation(0, 0);
            this.leavingIcon.visible = false;
            this.bankrupt.visible = false;
            this.magnate.visible = false;
            this.afkIcon.visible = false;
            return;
        }

        this.sitPlace != SitPlace.BOTTOM && this.gameStateData?.phase != GamePhase.PLAYING && this.roundUserData?.id != roundUserData.id && SoundsPlayer.play("opponentFounded");
        this.roundUserData = roundUserData;
        this.roundUserData.addListener(RoundUserDataEvent.NAME_CHANGED, this.onNameChanged, this);
        this.roundUserData.addListener(RoundUserDataEvent.ID_CHANGED, this.onIdChanged, this);
        this.onIdChanged();
        this.onNameChanged();

        this.roundUserData.addListener(RoundUserDataEvent.ICON_CHANGED, this.onIconChanged, this);
        this.roundUserData.addListener(RoundUserDataEvent.SIDE_CHANGED, this.onSideChanged, this);
        this.onSideChanged();

        this.updateCoins();

        this.updateScore(true);

        this.absentVals.setUserData(this.roundUserData);

        this.roundUserData.addListener(RoundUserDataEvent.STATE_CHANGED, this.onStateChanged, this);
        this.onStateChanged(this.roundUserData.state);

        this.roundUserData.addListener(RoundUserDataEvent.AFK_CHANGED, this.updateAfkIconVisibility, this);
        this.roundUserData.addListener(RoundUserDataEvent.ALIVE_CHANGED, this.updateAfkIconVisibility, this);
        this.updateAfkIconVisibility();
    }

    updateCoins() {
        this.onCoinsChanged((!this.roundUserData || this.roundUserData.side == SitPlace.NONE) ? -1 : this.roundUserData.coins);
    }

    updateAfkIconVisibility(): void {
        this.afkIcon.visible = this.roundUserData.side != SitPlace.NONE && (this.roundUserData.afk);
    }

    onStateChanged(state: UserState): void {
        this.leavingIcon.visible = state == UserState.LEAVING;
        let spectating: boolean = state == UserState.SPECTATING;
        this.specIcon.visible = spectating;
        if (this.sitPlace == SitPlace.BOTTOM) {
            dispatchEvent(new MessageEvent(GameEvents.SPECTATING, {data: spectating}));
        }
    }

    private onPiecePlaceChanged(): void {
        this.dominosLeft.setValue(this.gameStateData.pieces.interfaces.filter(pieceData => pieceData.place == PiecePlace.WORKSET && pieceData.side == this.sitPlace).length);
    }

    setScale(scale: number = 1) {
        this.scaleTween?.kill();
        this.scaleTween = TweenMax.to(this.scaleContainer.scale, .3, {
            x: scale,
            y: scale,
            ease: Linear.easeNone
        });
    }

    exitTimer() {
        this.timerRound.killTimer();
        this.setScale(.9);
        SoundsPlayer.stop("countdown");
    }

    async onAvatarClick(): Promise<void> {
        if (!this.roundUserData?.id || this.roundUserData.id == -1) {
            return;
        }
        let profileData: ProfileData = await DynamicData.profiles.getFullProfileById(this.roundUserData.id);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_PROFILE_POPUP, {data: {profileData, overlayAlpha: .75}}));
    }

    async showWinner(show: boolean = true): Promise<void> {
        if (show) {
            this.winnerLabel.animateLoop();
            this.winnerLabel.visible = true;
            await Timeout.seconds(2);
            this.hideWinner();
        } else {
            this.hideWinner();
        }
    }

    private hideWinner(): void {
        this.winnerLabel.stop();
        this.winnerLabel.visible = false;
    }

    private onGiftButtonClicked(): void {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_GIFTS_PANEL, {data: this.roundUserData.id}));
    }

    private onFocusChanged(): void {
        if (!this.gameStateData) {
            return;
        }
        WindowFocusController.documentVisible ? this.updateTimer() : this.exitTimer();
        WindowFocusController.documentVisible && this.updateCoins();
    }

    private onProfileUpdated() {
        if (this.sitPlace != SitPlace.BOTTOM) {
            return;
        }
        this.onIconChanged();
        this.setName(DynamicData.myProfile.name);
    }

    private onIconChanged() {
        if (this.sitPlace != SitPlace.BOTTOM && this.roundUserData.side == SitPlace.NONE) {
            this.setEmptyAva();
            this.giftButton.visible = false;
            return;
        }
        this.avaContainer.removeChild(this.avatar);
        this.avatar.destroy();
        let data: PlayerData;
        if (this.sitPlace == SitPlace.BOTTOM) {
            data = {id: DynamicData.myProfile.id, icon: DynamicData.myProfile.icon, name: DynamicData.myProfile.name, level: DynamicData.myProfile.level};
        } else {
            data = {id: this.roundUserData.id, icon: this.roundUserData.icon, name: this.roundUserData.name, level: this.roundUserData.config.level};
        }
        this.avatarTextureName = AvatarService.getAvatarTextureNameByProfile(data);
        this.avatar = DisplayObjectFactory.createSprite(this.avatarTextureName, this.avatarSize);
        this.avaContainer.addChildAt(this.avatar, 0);
        this.avatar.mask = this.avatarMask;
        Pivot.center(this.avatar);
        DynamicData.profiles.setFullProfileIconById(data.id, data.icon);
    }

    showMagnate(): void {
        this.magnate.scale.set(1.5);
        this.magnate.y = -20;
        this.magnate.alpha = 0;
        this.magnate.visible = true;
        TweenMax.to(this.magnate.scale, .3, {x: 1, y: 1, ease: Linear.easeNone});
        TweenMax.to(this.magnate, .3, {alpha: 1, y: 0, ease: Linear.easeNone});
    }

    private onNameChanged() {
        this.setName(this.roundUserData.name);
        DynamicData.profiles.setFullProfileNameById(this.roundUserData.id, this.roundUserData.name);
    }

    private onIdChanged() {
        this.sitPlace != SitPlace.BOTTOM && this.roundUserData.id > -1 && dispatchEvent(new MessageEvent(GameEvents.OPPONENT_FOUND));
    }

    private setName(value: string) {
        this.nameText.text = value;
        Pivot.center(this.nameText);
        this.giftButton.visible = this.sitPlace != SitPlace.BOTTOM && !!value;
    }

    onScoreChanged(score: number) {
        if (DynamicData.socketGameRequest.mode == GameMode.FIVES && this.gameStateData?.phase == GamePhase.END) {
            return;
        }
        this.playerScore.setValue(score);
    }

    private updateTimer() {
        if (this.gameStateData.turn == this.sitPlace && this.gameStateData.timerDurationMillis > 0) {
            this.timerRound.setTimer(this.gameStateData.timerDurationMillis, this.gameStateData.timerEndMillis - Date.now(), this.sitPlace);
            this.setScale();
        } else {
            this.exitTimer();
        }
    }

    showBankrupt(): void {
        this.bankrupt.scale.set(1.5);
        this.bankrupt.y = -20;
        this.bankrupt.alpha = 0;
        this.bankrupt.visible = true;
        TweenMax.to(this.bankrupt.scale, .3, {x: 1, y: 1, ease: Linear.easeNone});
        TweenMax.to(this.bankrupt, .3, {alpha: 1, y: 0, ease: Linear.easeNone});
    }

    onCoinsChanged(coins: number) {
        this.money.setValue((!this.roundUserData || this.roundUserData.id == -1) ? 0 : coins);
    }

    private createChildren() {
        this.scaleContainer = DisplayObjectFactory.createSprite();
        this.avaContainer = new Button({callback: this.onAvatarClick.bind(this), disabledOffline: true});
        this.avatar = DisplayObjectFactory.createSprite("table/sit/empty");
        this.avatarMask = GraphicsFactory.createRoundedRect(0, 0, this.avatarSize, this.avatarSize, 30);
        this.avaFrame = DisplayObjectFactory.createNineSlicePlane("table/sit/ava_frame", 55, 55, 55, 55);
        this.timerRound = new TimerRound(this.avatar.width, this.avatar.height);
        this.dominosLeft = new DominosLeft();
        this.absentVals = new AbsentVals();
        this.money = new SitMoney();
        this.nameText = TextFactory.createCommissioner({fontSize: 26, value: ""});
        this.bubble = new Bubble(this.sitPlace);
        this.dealerButton = new DealerButton();
        this.playerScore = new PlayerScore(.8);
        this.giftButton = new Button({callback: this.onGiftButtonClicked.bind(this), bgTextureName: "table/gifts/gift_btn"});
        this.giftSpine = SpineFactory.createGiftSpine();
        this.giftIdleSpine = SpineFactory.createGiftSpine();
        this.winnerLabel = new WinnerLabel(LanguageService.getTextByKey("PlayerAvatarStatus/winner"));
        this.leavingIcon = DisplayObjectFactory.createSprite("table/sit/leave");
        this.specIcon = DisplayObjectFactory.createSprite("table/sit/spec");
        this.afkIcon = DisplayObjectFactory.createSprite("table/sit/bot");
        this.magnate = new Sprite(LoaderService.getTexture("table/sit/magnate"));
        this.bankrupt = new Sprite(LoaderService.getTexture("table/sit/bankrupt"));
    }

    updateScore(initial: boolean = false, winScore: boolean = false) {
        let value: number = this.roundUserData.score + this.roundUserData.moveScore;
        if (winScore) {
            value += this.roundUserData.winScore;
        }
        this.playerScore.setValue(value, initial);
    }

    showGift(giftConfig: GiftConfig): void {
        SoundsPlayer.play("gifts/" + giftConfig.sound);
        this.giftSpine.state.addListener({complete: this.showGiftIdle.bind(this, giftConfig)});
        this.giftSpine.state.setAnimation(0, giftConfig.effectAnimation, false);
        this.setGiftSpineVisible();
    }

    showGiftIdle(giftConfig: GiftConfig): void {
        this.giftIdleSpine.state.setAnimation(0, giftConfig.idleAnimation, false);
        this.setGiftIdleSpineVisible();
        this.setGiftSpineVisible(false);
    }

    private clearRoundUserData() {
        this.setEmptyAva();
        this.clearRoundUserDataListeners();
        this.absentVals.clearRoundUserData();
        this.roundUserData = undefined;
    }

    sayPass() {
        this.bubble.showText("PASS");
        SoundsPlayer.playPassSound(this.avatarTextureName);
    }

    private addChildren() {
        this.addChild(this.giftButton).visible = false;
        this.addChild(this.playerScore);
        this.addChild(this.scaleContainer);
        this.scaleContainer.addChild(this.avaContainer);
        this.scaleContainer.addChild(this.specIcon).visible = false;
        this.scaleContainer.addChild(this.afkIcon).visible = false;
        this.scaleContainer.addChild(this.avaFrame);
        this.scaleContainer.addChild(this.timerRound);
        this.scaleContainer.addChild(this.dominosLeft);
        this.scaleContainer.addChild(this.dealerButton).visible = false;
        this.avaContainer.addChild(this.avatar);
        this.avaContainer.addChild(this.avatarMask);
        this.avaContainer.addChild(this.giftIdleSpine);
        this.addChild(this.absentVals);
        this.addChild(this.nameText);
        this.addChild(this.money);
        this.addChild(this.bubble);
        this.addChild(this.giftSpine);
        this.addChild(this.winnerLabel);
        this.addChild(this.leavingIcon).visible = false;
        this.addChild(this.bankrupt).visible = false;
        this.addChild(this.magnate).visible = false;
    }

    private initChildren() {
        Pivot.center(this.leavingIcon);
        Pivot.center(this.avatar);
        this.avaFrame.width = this.avatar.width;
        this.avaFrame.height = this.avatar.height;
        Pivot.center(this.avaFrame);
        Pivot.center(this.avatarMask);
        this.avatar.mask = this.avatarMask;
        this.giftIdleSpine.mask = this.avatarMask;

        this.dominosLeft.x = 72;
        this.dominosLeft.y = 36;

        this.absentVals.y = -100;

        this.nameText.y = 90;
        this.nameText.style.stroke = 0x333333;
        this.nameText.style.strokeThickness = 4;

        this.money.y = 130;
        switch (this.sitPlace) {
            case SitPlace.LEFT:
                this.playerScore.x = 0;
                this.playerScore.y = -160;
                this.bubble.x = 170;
                this.bubble.y = -110;
                this.giftButton.x = 120;
                this.leavingIcon.x = 120;
                break;
            case SitPlace.RIGHT:
                this.playerScore.x = 0;
                this.playerScore.y = -160;
                this.bubble.x = -170;
                this.bubble.y = -110;
                this.giftButton.x = -120;
                this.leavingIcon.x = -120;
                break;
            case SitPlace.TOP:
                this.playerScore.x = 170;
                this.bubble.y = 130;
                this.bubble.x = -220;
                this.giftButton.x = -120;
                this.leavingIcon.x = -120;

                break;
            case SitPlace.BOTTOM:
                this.leavingIcon.x = 120;
                this.playerScore.x = 170;
                this.bubble.y = -130;
                this.bubble.x = 160;
                break;
        }
        this.leavingIcon.y = -20;
        this.giftButton.y = 35;
        this.showWinner(false);
        Pivot.center(this.bankrupt);
        Pivot.center(this.magnate);
        Pivot.center(this.specIcon);
        Pivot.center(this.afkIcon);
    }

    private setEmptyAva() {
        this.avatar.texture = LoaderService.getTexture("table/sit/empty");
        this.avatar.height = this.avatar.width = this.avatarSize + 28;
        Pivot.center(this.avatar);
    }

    private onSideChanged() {
        this.setGiftSpineVisible(false);
        this.setGiftIdleSpineVisible(false);
        this.onIconChanged();
        this.updateCoins();
    }

    private async onMoveScoreChanged(moveScore: number, initial: boolean = false): Promise<void> {
        if (DynamicData.socketGameRequest.mode != GameMode.FIVES) {
            this.onScoreChanged(moveScore);
            return;
        }
        if (this.gameStateData.phase == GamePhase.END) {
            return;
        }
        /*let scoreDelta: number = moveScore + this.roundUserData.score - this.playerScore.value;
        initial || scoreDelta > 0 && await new Promise(resolve => dispatchEvent(new MessageEvent(GameEvents.FLY_POINTS, {data: {sit: this, score: scoreDelta, callback: resolve, lastPlayedDomino: this.lastPlayedDomino}})));
        this.onScoreChanged(moveScore + this.roundUserData.score);*/
    }

    private setGiftSpineVisible(value: boolean = true) {
        this.giftSpine.visible = value;
        this.giftSpine.state.timeScale = value ? 1 : 0;
    }

    private setGiftIdleSpineVisible(value: boolean = true) {
        this.giftIdleSpine.visible = value;
        this.giftIdleSpine.state.timeScale = value ? 1 : 0;
    }

    getNextScoreIndex() {
        if (this.scoreIndex > 4) {
            this.scoreIndex = 4;
        }
        return this.scoreIndex++;
    }

    resetPointsIndex() {
        this.scoreIndex = 0;
    }

    private clearGameStateData() {
        this.gameStateData?.removeListener(GameStateEvents.TIMER_END_DELAY_MILLIS_CHANGED, this.updateTimer, this);
        this.gameStateData?.pieces.classes.forEach(pieceData => pieceData.removeListener(PieceDataEvent.PLACE_CHANGED, this.onPiecePlaceChanged, this));
        this.gameStateData?.removeListener(GameStateEvents.PHASE_CHANGED, this.onPhaseChanged, this);
        this.gameStateData = undefined;
    }

    private async onPhaseChanged(): Promise<void> {
        if (this.gameStateData.phase != GamePhase.SCORING
            || DynamicData.socketGameRequest.mode != GameMode.PRO
            || !this.roundUserData
            || this.roundUserData?.id == -1
            || this.roundUserData.state == UserState.SPECTATING) {
            return;
        }
        let bankrupt: boolean = this.roundUserData.coins < StaticData.getCurrentGameConfig().minBalanceCoins;
        let magnate: boolean = this.roundUserData.coins > StaticData.getCurrentGameConfig().maxBalanceCoins;
        await Timeout.seconds(2);
        magnate && this.showMagnate();
        bankrupt && this.showBankrupt();
        if (!bankrupt && !magnate) {
            return;
        }
        await Timeout.seconds(2);
        if (this._destroyed) {
            return;
        }
        this.bankrupt.visible = false;
        this.magnate.visible = false;
    }

    private clearRoundUserDataListeners() {
        this.roundUserData?.removeListener(RoundUserDataEvent.NAME_CHANGED, this.onNameChanged, this);
        this.roundUserData?.removeListener(RoundUserDataEvent.ID_CHANGED, this.onIdChanged, this);
        this.roundUserData?.removeListener(RoundUserDataEvent.ICON_CHANGED, this.onIconChanged, this);
        this.roundUserData?.removeListener(RoundUserDataEvent.SIDE_CHANGED, this.onSideChanged, this);
        this.roundUserData?.removeListener(RoundUserDataEvent.STATE_CHANGED, this.onStateChanged, this);
        this.roundUserData?.removeListener(RoundUserDataEvent.AFK_CHANGED, this.updateAfkIconVisibility, this);
        this.roundUserData?.removeListener(RoundUserDataEvent.ALIVE_CHANGED, this.updateAfkIconVisibility, this);
    }
}