import {DominoCalculator} from "@azur-games/pixi-domino-core";
import gsap from "gsap";
import {Sine, TweenMax} from "gsap/gsap-core";
import {Point, RenderTexture, Sprite} from "pixi.js";
import {MaterialRenderSortType, Matrix4x4, Mesh3D, PickingHitArea, Quaternion, Sprite3D, StandardMaterial, StandardMaterialAlphaMode} from "pixi3d";
import {DominoGame} from "../../../../app";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {ArrayWrapEvent} from "../../../../data/active_data/base/static_config_data/array_wrap/ArrayWrapEvent";
import {PieceJointData} from "../../../../data/active_data/game_state/piece_data/PieceJointData";
import {GameStateData, GameStateEvents} from "../../../../data/active_data/GameStateData";
import {ActiveData} from "../../../../data/ActiveData";
import {GamePhase} from "../../../../dynamic_data/GamePhase";
import {PieceRot} from "../../../../dynamic_data/IPieceData";
import {IPieceJointData} from "../../../../dynamic_data/IPieceJointData";
import {IPossibleMoveData} from "../../../../dynamic_data/IPossibleMoveData";
import {MoveAction} from "../../../../dynamic_data/MoveAction";
import {PiecePlace} from "../../../../dynamic_data/PiecePlace";
import {SitPlace} from "../../../../dynamic_data/SitPlace";
import {DynamicData} from "../../../../DynamicData";
import {GameEvents} from "../../../../GameEvents";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {GameMode} from "../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SocketService} from "../../../../services/SocketService";
import {SoundsPlayer} from "../../../../services/SoundsPlayer";
import {StaticData} from "../../../../StaticData";
import {Settings3D} from "../../../../utils/Settings3D";
import {Timeout} from "@azur-games/pixi-vip-framework";
import {CoorsAndCorner} from "./domino_logic/CoorsAndCorner";
import {Direction, DirectionTurn} from "./domino_logic/Direction";
import {DominoItem} from "./domino_logic/DominoItem";
import {Position} from "./domino_logic/Position";
import {PositionDirectionDirectionTurn} from "./domino_logic/PositionDirectionDirectionTurn";
import {Vector} from "./domino_logic/Vector";
import {BazarContainer} from "./dominoes_table/BazarContainer";
import {TableContainer} from "./dominoes_table/TableContainer";
import {DominoLogic} from "./DominoLogic";
import {ScoreRound} from "./ScoreRound";
import {Sit} from "./Sit";


export class DominoesTable extends Sprite3D {
    private onSelectorClickedBindThis: (e: MessageEvent) => void;
    private onDominoPlaceChangedBindThis: (e: MessageEvent) => void;
    private onDominoClickedBindThis: (e: MessageEvent) => void;
    private onDominoDraggingBindThis: (e: MessageEvent) => void;
    private onDominoPointerDownBindThis: (e: MessageEvent) => void;
    private onSitsResizedBindThis: (e: MessageEvent) => void;
    private onBazarIconResizedBindThis: (e: MessageEvent) => void;
    private gameStateData: GameStateData;
    private dominoItems: DominoItem[] = [];

    private selectedDominoItem: DominoItem;
    private hasSpinner: boolean;

    private distributionContainer: Sprite3D;
    private myHandContainer: Sprite3D;
    private tableContainer: TableContainer;
    private bazarContainer: BazarContainer;
    private bazarIconContainer: Sprite3D;
    private spinnerContainer: Sprite3D;
    private lastInHandContainer: Sprite3D;
    private showContainer: Sprite3D;
    private topHandContainer: Sprite3D;
    private leftHandContainer: Sprite3D;
    private rightHandContainer: Sprite3D;
    private takingFromBazarInProgress: boolean;
    private takingFromBazarResolve: Function;
    dominoPlayInProgress: boolean;
    dominoPlayCompleteResolve: Function;
    private closestPossibleMoveData: IPossibleMoveData;
    private singleNormalSelector: Mesh3D;
    private singleDoubleSelector: Mesh3D;
    private singlePoints: Mesh3D;
    private selectors: Mesh3D[] = [];
    private highlights: Mesh3D[] = [];
    private highlights_double: Mesh3D[] = [];
    private possibleMoveDataBySelector: Map<Mesh3D, IPossibleMoveData> = new Map<Mesh3D, IPossibleMoveData>();
    private points: Mesh3D[] = [];

    get tableDominoes(): DominoItem[] {
        return this.dominoItems.filter(dominoItem => dominoItem.onTable);
    }

    constructor(private dragContainer: Sprite3D, private dragContainerInner: Sprite3D) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.onDominoPlaceChangedBindThis = this.onDominoPlaceChanged.bind(this);
        addEventListener(GameEvents.DOMINO_PLACE_CHANGED, this.onDominoPlaceChangedBindThis);

        this.onDominoClickedBindThis = this.onDominoClicked.bind(this);
        addEventListener(GameEvents.DOMINO_CLICKED, this.onDominoClickedBindThis);

        this.onDominoDraggingBindThis = this.onDominoDragging.bind(this);
        addEventListener(GameEvents.DOMINO_DRAGGING, this.onDominoDraggingBindThis);

        this.onDominoPointerDownBindThis = this.onDominoPointerDown.bind(this);
        addEventListener(GameEvents.DOMINO_POINTERDOWN, this.onDominoPointerDownBindThis);

        this.onSitsResizedBindThis = this.onSitsResized.bind(this);
        addEventListener(GameEvents.SITS_RESIZED, this.onSitsResizedBindThis);

        this.onBazarIconResizedBindThis = this.onBazarIconResized.bind(this);
        addEventListener(GameEvents.BAZAR_ICON_RESIZED, this.onBazarIconResizedBindThis);

        for (let i = 0; i < 4; i++) {
            let selector: Mesh3D = this.createSelector(true);
            let highlight: Mesh3D = this.createSelector(true, 1.5, "table/highlight", MaterialRenderSortType.transparent);
            let highlight_double: Mesh3D = this.createSelector(true, 2.4, "table/highlight_double", MaterialRenderSortType.transparent);
            this.tableContainer.addChild(selector).visible = false;
            this.tableContainer.addChild(highlight).visible = false;
            this.tableContainer.addChild(highlight_double).visible = false;
            selector.hitArea = new PickingHitArea(selector);
            highlight.hitArea = new PickingHitArea(highlight);
            highlight_double.hitArea = new PickingHitArea(highlight_double);
            this.selectors.push(selector);
            this.highlights.push(highlight);
            this.highlights_double.push(highlight_double);
        }
    }

    get placedDominoes(): DominoItem[] {
        return this.dominoItems.filter(dominoItem => dominoItem.placed);
    }

    static ToEulerAngles(q: Quaternion): {x: number, y: number, z: number} {
        // roll (x-axis rotation)
        let sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
        let cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
        let x = Math.atan2(sinr_cosp, cosr_cosp);

        // pitch (y-axis rotation)
        let sinp = Math.sqrt(1 + 2 * (q.w * q.y - q.x * q.z));
        let cosp = Math.sqrt(1 - 2 * (q.w * q.y - q.x * q.z));
        let y = 2 * Math.atan2(sinp, cosp) - Math.PI / 2;

        // yaw (z-axis rotation)
        let siny_cosp = 2 * (q.w * q.z + q.x * q.y);
        let cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
        let z = Math.atan2(siny_cosp, cosy_cosp);

        x = x * 180 / Math.PI;
        y = y * 180 / Math.PI;
        z = z * 180 / Math.PI;

        return {x, y, z};
    }

    resetDominos(): void {
        this.dominoItems.forEach(dominoItem => {
            this.moveToContainer(dominoItem, this.distributionContainer);
            dominoItem.reset();
        });
    }

    static createPoints(score: number): Mesh3D {
        let value: number = score;
        let pointsGreen: boolean = !(value % 5) && value != 0;
        let pointsSprite: ScoreRound = new ScoreRound(value, pointsGreen);
        pointsSprite.visible = true;

        let renderTexture: RenderTexture = RenderTexture.create(100, 100);
        pointsSprite.position.x = 100 / 2;
        pointsSprite.position.y = 100 / 2;
        pointsSprite.anchor.x = 0.5;
        pointsSprite.anchor.y = 0.5;

        DominoGame.instance.app.renderer.render(pointsSprite, {renderTexture});
        pointsSprite.destroy();
        let material: StandardMaterial = new StandardMaterial();
        material.baseColorTexture = renderTexture;
        material.alphaCutoff = .3;
        material.unlit = true;
        material.doubleSided = true;
        material.alphaMode = StandardMaterialAlphaMode.mask;

        let points: Mesh3D = Mesh3D.createPlane(material);
        points.scale.set(1.2);
        points.rotationQuaternion.setEulerAngles(0, 180, 0);
        return points;
    }

    getDominoItemByNumbers(pieceNumber: [any, any]): DominoItem {
        return this.dominoItems.find(dominoData => (dominoData.pieceData?.values.length == 2 && dominoData.pieceData?.values.getAt(0).value == pieceNumber[0] && dominoData.pieceData?.values.getAt(1).value == pieceNumber[1]));
    }

    clearPoints(): void {
        let point: Mesh3D;
        while (this.points.length) {
            point = this.points.shift();
            this.tableContainer.removeChild(point);
            point.destroy();
            point = null;
        }
    }

    setGameStateData(socketGameState: GameStateData): void {
        this.gameStateData?.removeListener(GameStateEvents.TURN_CHANGED, this.onTurnChanged, this);
        this.gameStateData?.removeListener(GameStateEvents.TAKING_UNUSED_CHANGED, this.onTurnChanged, this);
        this.gameStateData?.possibleMoves.removeListener(ArrayWrapEvent.ELEMENT_ADDED, this.onPossibleMovesChanged, this);
        this.gameStateData?.possibleMoves.removeListener(ArrayWrapEvent.ELEMENT_REMOVED, this.onPossibleMovesChanged, this);
        this.gameStateData?.possibleMoves.removeListener(ArrayWrapEvent.ELEMENT_CHANGED, this.onPossibleMovesChanged, this);

        this.clearDominoes();

        this.gameStateData = socketGameState;
        this.dominoItems = this.gameStateData.pieces.classes.map(pieceData => {
            let dominoItem: DominoItem = new DominoItem(pieceData);
            this.distributionContainer.addChild(dominoItem);
            return dominoItem;
        });
        this.dominoItems.forEach(dominoItem => dominoItem.init());

        this.gameStateData.addListener(GameStateEvents.TURN_CHANGED, this.onTurnChanged, this);
        this.gameStateData.addListener(GameStateEvents.TAKING_UNUSED_CHANGED, this.onTurnChanged, this);
        this.gameStateData.possibleMoves.addListener(ArrayWrapEvent.ELEMENT_ADDED, this.onPossibleMovesChanged, this);
        this.gameStateData.possibleMoves.addListener(ArrayWrapEvent.ELEMENT_REMOVED, this.onPossibleMovesChanged, this);
        this.gameStateData.possibleMoves.addListener(ArrayWrapEvent.ELEMENT_CHANGED, this.onPossibleMovesChanged, this);
    }

    setClickableDominoes() {
        let dominoItem: DominoItem;
        this.gameStateData.possibleMoves?.interfaces.filter(_ => _.action != MoveAction.TAKE).forEach(possibleMove => {
            dominoItem = this.getDominoItemByNumbers(possibleMove.piece);
            dominoItem?.setAlpha(true);
            dominoItem?.setClickable(true);
        });
    }

    inHandReposition(fast: boolean = !WindowFocusController.documentVisible) {
        if (!this.gameStateData) {
            return;
        }

        let inHand: DominoItem[] = this.dominoItems.filter(dominoItem => dominoItem.pieceData.place == PiecePlace.WORKSET && dominoItem.pieceData.side == SitPlace.BOTTOM && !dominoItem.scoring && !dominoItem.draggingOverTable);
        inHand.forEach(item => !item.draggingOverHand && !item.draggingOverTable && this.moveToContainer(item, this.myHandContainer));
        inHand.sort(this.sortFunction);
        let bottomRow: DominoItem[] = inHand.filter((dominoData: DominoItem, index: number) => index < 13);
        let topRow: DominoItem[] = inHand.filter((dominoData: DominoItem, index: number) => index > 12);
        inHand.forEach((dominoData: DominoItem, index: number) => {
                dominoData.topDirectionOpened = false;
                dominoData.bottomDirectionOpened = false;
                dominoData.leftDirectionOpened = false;
                dominoData.rightDirectionOpened = false;
            }
        );

        bottomRow.forEach((dominoItem: DominoItem, index: number) => {
                if (dominoItem.draggingOverHand || dominoItem.draggingOverTable) {
                    return;
                }
                let goX: number = (index - (bottomRow.length - 1) / 2) * 2.5;
                dominoItem.setVisible(true);
                if (fast) {
                    dominoItem.x = goX;
                    dominoItem.y = 0;
                    dominoItem.z = 0;
                    dominoItem.modelRotationX = 0;
                    dominoItem.modelRotationY = 0;
                    dominoItem.modelRotationZ = 180;
                    dominoItem.modelScale = 1;
                } else {
                    WindowFocusController.wrapTween(TweenMax.to(dominoItem, .3, {
                        x: goX,
                        y: 0,
                        z: 0,
                        modelRotationX: 0,
                        modelRotationY: 0,
                        modelRotationZ: 180,
                        modelScale: 1,
                        ease: Sine.easeInOut
                    }));
                }
            }
        );
        let goZ = -8.5;
        topRow.forEach((dominoItem: DominoItem, index: number) => {
                if (dominoItem.draggingOverHand || dominoItem.draggingOverTable) {
                    return;
                }
                let goX: number = (index - (topRow.length - 1) / 2) * 2.3;
                if (fast) {
                    dominoItem.modelScale = .9;
                    dominoItem.setVisible(true);
                    dominoItem.x = goX;
                    dominoItem.y = 0;
                    dominoItem.z = goZ;
                    dominoItem.modelRotationX = 0;
                    dominoItem.modelRotationY = 0;
                    dominoItem.modelRotationZ = 180;
                } else {
                    WindowFocusController.wrapTween(gsap.to(dominoItem, .3, {
                        x: goX,
                        y: 0,
                        z: goZ,
                        modelRotationX: 0,
                        modelRotationY: 0,
                        modelRotationZ: 180,
                        modelScale: .9,
                        ease: Sine.easeInOut
                    }));
                }
            }
        );

    }

    async addDomino(prevDominoItem: DominoItem, nextDominoItem: DominoItem, coorsAndCorner: CoorsAndCorner, fast: boolean = !WindowFocusController.documentVisible, lastInHand: boolean) {
        if (nextDominoItem.pieceData.side != SitPlace.BOTTOM && !fast) {
            nextDominoItem.alpha = 0;
            nextDominoItem.modelScale = .8;
        }
        nextDominoItem.setVisible(true);
        nextDominoItem.onTable = true;
        nextDominoItem.setAlpha(true);

        let showSpinner: boolean = DynamicData.socketGameRequest.mode == GameMode.FIVES && nextDominoItem.double && !this.hasSpinner;
        if (showSpinner) {
            this.hasSpinner = true;
        }
        if (!fast && (showSpinner || lastInHand)) {
            if (showSpinner) {
                dispatchEvent(new MessageEvent(GameEvents.SPINNER, {data: null}));
                await this.rotateSpinner(nextDominoItem);
            } else {
                await this.rotateLastInHand(nextDominoItem);
            }
        }
        this.moveToContainer(nextDominoItem, this.tableContainer);
        let flyDuration: number = .4 + Math.random() * .07;
        let promises: Promise<void>[] = [];

        nextDominoItem.setMoveDirection(coorsAndCorner.direction);
        nextDominoItem.rotateVectors(coorsAndCorner);
        promises.push(nextDominoItem.setPositionOver(coorsAndCorner, flyDuration, fast));
        promises.push(nextDominoItem.setRotation(nextDominoItem.getGoRotationZ(), fast, flyDuration));
        if (prevDominoItem) {
            nextDominoItem.bottomDirectionOpened = false;
        }
        await Promise.all(promises);

    }

    onDominoPointerDown(e: MessageEvent): void {
        let inHand: DominoItem[] = this.dominoItems.filter(dominoItem => dominoItem.pieceData.place == PiecePlace.WORKSET && dominoItem.pieceData.side == SitPlace.BOTTOM && !dominoItem.scoring && !dominoItem.draggingOverTable);
        let dominoItem: DominoItem = e.data;
        this.dragContainerInner.addChild(dominoItem);
        inHand.forEach(item => item.makeBigger(false));
        this.hideOnTableJointButtons();

        //this.setTableJointButtons(dominoItem);
        dominoItem.makeBigger(true);
    }

    onDominoDragging(e: MessageEvent): void {
        let dominoItem: DominoItem = e.data;
        if (dominoItem.worldTransform.position.y - 1 < this.myHandContainer.worldTransform.position.y) {
            if (dominoItem.draggingOverTable) {
                dispatchEvent(new MessageEvent(GameEvents.DRAG_OVER_HAND, {data: null}));
                dominoItem.draggingOverHand = true;
                dominoItem.draggingOverTable = false;
                this.inHandReposition();
                this.hideOnTableJointButtons();
            }
        } else {
            if (dominoItem.draggingOverHand) {
                dispatchEvent(new MessageEvent(GameEvents.DRAG_OVER_TABLE, {data: null}));
                dominoItem.draggingOverTable = true;
                dominoItem.draggingOverHand = false;
                this.inHandReposition();
                this.setTableJointButtons(dominoItem);
            }
        }

        if (dominoItem.draggingOverTable && dominoItem.dragged) {
            this.showClosestTableJointButtons(dominoItem);
        }
    }

    onDominoClicked(e: MessageEvent): void {
        this.clearPoints();
        this.hideOnTableJointButtons();
        let clickedItem: DominoItem = e.data;
        this.myHandContainer.addChild(clickedItem);
        if ((clickedItem.draggingOverHand || !SocketService.mainConnection.connectionSent) && clickedItem.dragged) {
            clickedItem.draggingOverHand = false;
            this.inHandReposition();
            clickedItem.makeBigger(false);
            return;
        }
        this.selectedDominoItem = e.data;

        if (clickedItem.dragged) {
            SocketService.optimisticMove(this.closestPossibleMoveData, this.selectedDominoItem);
            this.hideSelectors();
            clickedItem.makeBigger(false);
            return;
        }

        let possibleMoves: IPossibleMoveData[] = ActiveData.gameStateData.possibleMoves.interfaces.filter(possibleMoves => this.selectedDominoItem.bottom == possibleMoves.piece[0] && this.selectedDominoItem.top == possibleMoves.piece[1]);
        if (possibleMoves.length == 1) {
            SocketService.optimisticMove(possibleMoves[0], this.selectedDominoItem);
            this.hideSelectors();
            clickedItem.makeBigger(false);
        } else {
            if (!clickedItem.dragged) {
                clickedItem.draggingOverHand = clickedItem.draggingOverTable = false;
                this.inHandReposition();
            }
            this.setTableJointButtons(this.selectedDominoItem);
        }
    }

    destroy() {
        this.possibleMoveDataBySelector.clear();
        this.possibleMoveDataBySelector = undefined;

        this.clearSelectors();
        this.clearHighLights();
        this.selectors = undefined;
        this.highlights = undefined;
        this.highlights_double = undefined;

        this.clearPoints();
        this.points = undefined;

        this.dragContainer = undefined;
        this.dragContainerInner = undefined;

        this.gameStateData?.removeListener(GameStateEvents.TURN_CHANGED, this.onTurnChanged, this);
        this.gameStateData?.removeListener(GameStateEvents.TAKING_UNUSED_CHANGED, this.onTurnChanged, this);
        this.gameStateData?.possibleMoves.removeListener(ArrayWrapEvent.ELEMENT_ADDED, this.onPossibleMovesChanged, this);
        this.gameStateData?.possibleMoves.removeListener(ArrayWrapEvent.ELEMENT_REMOVED, this.onPossibleMovesChanged, this);
        this.gameStateData?.possibleMoves.removeListener(ArrayWrapEvent.ELEMENT_CHANGED, this.onPossibleMovesChanged, this);

        this.clearDominoes();

        this.dominoItems = undefined;

        removeEventListener(GameEvents.DOMINO_PLACE_CHANGED, this.onDominoPlaceChangedBindThis);
        this.onDominoPlaceChangedBindThis = undefined;

        removeEventListener(GameEvents.DOMINO_CLICKED, this.onDominoClickedBindThis);
        this.onDominoClickedBindThis = undefined;

        removeEventListener(GameEvents.DOMINO_DRAGGING, this.onDominoDraggingBindThis);
        this.onDominoDraggingBindThis = undefined;

        removeEventListener(GameEvents.DOMINO_POINTERDOWN, this.onDominoPointerDownBindThis);
        this.onDominoPointerDownBindThis = undefined;

        removeEventListener(GameEvents.SITS_RESIZED, this.onSitsResizedBindThis);
        this.onSitsResizedBindThis = undefined;

        removeEventListener(GameEvents.BAZAR_ICON_RESIZED, this.onBazarIconResizedBindThis);
        this.onBazarIconResizedBindThis = undefined;

        this.destroySinglePoints();
        this.tableContainer.removeChild(this.singleNormalSelector);
        this.tableContainer.removeChild(this.singleDoubleSelector);
        this.removeChild(this.distributionContainer);
        this.removeChild(this.myHandContainer);
        this.removeChild(this.tableContainer);
        this.removeChild(this.bazarContainer);
        this.removeChild(this.bazarIconContainer);
        this.removeChild(this.spinnerContainer);
        this.removeChild(this.lastInHandContainer);
        this.removeChild(this.showContainer);
        this.removeChild(this.topHandContainer);
        this.removeChild(this.leftHandContainer);
        this.removeChild(this.rightHandContainer);

        this.singleNormalSelector.destroy();
        this.singleDoubleSelector.destroy();
        this.distributionContainer.destroy();
        this.myHandContainer.destroy();
        this.tableContainer.destroy();
        this.bazarContainer.destroy();
        this.bazarIconContainer.destroy();
        this.spinnerContainer.destroy();
        this.lastInHandContainer.destroy();
        this.showContainer.destroy();
        this.topHandContainer.destroy();
        this.leftHandContainer.destroy();
        this.rightHandContainer.destroy();

        this.singleNormalSelector = undefined;
        this.singleDoubleSelector = undefined;
        this.distributionContainer = undefined;
        this.myHandContainer = undefined;
        this.tableContainer = undefined;
        this.bazarContainer = undefined;
        this.bazarIconContainer = undefined;
        this.spinnerContainer = undefined;
        this.lastInHandContainer = undefined;
        this.showContainer = undefined;
        this.topHandContainer = undefined;
        this.leftHandContainer = undefined;
        this.rightHandContainer = undefined;

        this.gameStateData = undefined;

        super.destroy();
    }

    async movePlayedPieces(fast: boolean): Promise<void> {
        let playedDominoes: DominoItem[] = this.dominoItems.filter(dominoItem => dominoItem.pieceData?.place == PiecePlace.PLAYED);
        playedDominoes.sort(this.sortFunction);
        let dominoItem: DominoItem;
        for (let dominioItemIndex: number = 0; dominioItemIndex < playedDominoes.length; dominioItemIndex++) {
            dominoItem = playedDominoes[dominioItemIndex];
            await this.playDomino(dominoItem, fast);
        }

        this.onTurnChanged();
    }

    async dominoFromBazar(dominoItem: DominoItem, fast: boolean): Promise<void> {
        SoundsPlayer.playTakeSound();
        if (dominoItem.pieceData.side == SitPlace.BOTTOM) {
            dominoItem.setClickable(false);
            dominoItem.setAlpha(false);
            this.inHandReposition(fast);
            this.setClickableDominoes();
            return;
        }
        this.takingFromBazarInProgress = true;
        let sitContainer: Sprite3D;
        switch (dominoItem.pieceData.side) {
            case SitPlace.TOP:
                sitContainer = this.topHandContainer;
                break;
            case SitPlace.LEFT:
                sitContainer = this.leftHandContainer;
                break;
            case SitPlace.RIGHT:
                sitContainer = this.rightHandContainer;
                break;
        }
        this.moveToContainer(dominoItem, sitContainer);
        dominoItem.updateTransform();
        if (fast) {
            dominoItem.x = 0;
            dominoItem.y = 0;
            dominoItem.z = 0;
            dominoItem.modelScale = .8;
        } else {
            await WindowFocusController.wrapTween(gsap.to(dominoItem, {x: 0, y: 0, z: 0, modelScale: .8, duration: .5}));
        }
        dominoItem.pieceData.place == PiecePlace.WORKSET && !dominoItem.pieceData.shown && dominoItem.tryRemoveMesh();
        this.takingFromBazarInProgress = false;
        this.takingFromBazarResolve && this.takingFromBazarResolve();
        this.takingFromBazarResolve = undefined;
    }

    private sortFunction(dominoItem1: DominoItem, dominoItem2: DominoItem) {
        return dominoItem1.pieceData?.order - dominoItem2.pieceData?.order;
    }

    async showHandsDominoes(fast: boolean = !WindowFocusController.documentVisible): Promise<void> {
        DominoLogic.resetUsed();
        await Timeout.seconds(2);
        this.tableDominoes.forEach(item => item.setVisible(false));

        let topCounting: DominoItem[] = this.dominoItems.filter(_ => _.pieceData.side == SitPlace.TOP && _.pieceData.place == PiecePlace.WORKSET);
        topCounting.forEach(dominoItem => {
            this.moveToContainer(dominoItem, this.topHandContainer);
            dominoItem.x = 0;
            dominoItem.y = 0;
            dominoItem.z = 0;
            dominoItem.alpha = 0;
            dominoItem.setVisible(true);
            dominoItem.updateTransform();
            this.moveToContainer(dominoItem, this.showContainer);
        });
        topCounting.sort(this.sortFunction);
        let promises: Promise<void>[] = [];
        topCounting.forEach((dominoItem: DominoItem, index: number) => {
            let goX: number = (index - (topCounting.length - 1) / 2) * 2.4;
            let goY: number = 5;
            let goZ: number = -3;
            if (fast) {
                dominoItem.x = goX;
                dominoItem.y = goY;
                dominoItem.z = goZ;
                dominoItem.setAlpha(true);
                dominoItem.modelScale = .89;
                dominoItem.modelRotationX = Settings3D.corner;
                dominoItem.modelRotationY = 0;
                dominoItem.modelRotationZ = 180;
            } else {
                promises.push(WindowFocusController.wrapTween(TweenMax.to(dominoItem, {
                    duration: .4,
                    delay: index * .1,
                    x: goX,
                    y: goY,
                    z: goZ,
                    alpha: 1,
                    modelRotationX: Settings3D.corner,
                    modelRotationY: 0,
                    modelRotationZ: 180,
                    modelScale: .89,
                    ease: Sine.easeInOut
                })));
            }
        });

        let leftCounting: DominoItem[] = this.dominoItems.filter(_ => _.pieceData.side == SitPlace.LEFT && _.pieceData.place == PiecePlace.WORKSET);
        leftCounting.forEach(dominoItem => {
            this.moveToContainer(dominoItem, this.leftHandContainer);
            dominoItem.x = 0;
            dominoItem.y = 0;
            dominoItem.z = 0;
            dominoItem.alpha = 0;
            dominoItem.setVisible(true);
            dominoItem.updateTransform();
            this.moveToContainer(dominoItem, this.showContainer);
        });
        leftCounting.sort(this.sortFunction);
        leftCounting.forEach((dominoItem: DominoItem, index: number) => {
            let goX: number = -25 + index * 2.4;
            let goY: number = 0;
            let goZ: number = -3;
            if (fast) {
                dominoItem.x = goX;
                dominoItem.y = goY;
                dominoItem.z = goZ;
                dominoItem.setAlpha(true);
                dominoItem.modelScale = .89;
                dominoItem.modelRotationX = 0;
                dominoItem.modelRotationY = Settings3D.corner;
                dominoItem.modelRotationZ = 90;
            } else {
                promises.push(WindowFocusController.wrapTween(TweenMax.to(dominoItem, {
                    duration: .4,
                    delay: index * .1,
                    x: goX,
                    y: goY,
                    z: goZ,
                    alpha: 1,
                    modelRotationX: Settings3D.corner,
                    modelRotationY: 0,
                    modelRotationZ: 180,
                    modelScale: .89,
                    ease: Sine.easeInOut
                })));
            }
        });

        let rightCounting: DominoItem[] = this.dominoItems.filter(_ => _.pieceData.side == SitPlace.RIGHT && _.pieceData.place == PiecePlace.WORKSET);
        rightCounting.forEach(dominoItem => {
            this.moveToContainer(dominoItem, this.rightHandContainer);
            dominoItem.x = 0;
            dominoItem.y = 0;
            dominoItem.z = 0;
            dominoItem.alpha = 0;
            dominoItem.setVisible(true);
            dominoItem.updateTransform();
            this.moveToContainer(dominoItem, this.showContainer);
        });
        rightCounting.sort(this.sortFunction);
        rightCounting.forEach((dominoItem: DominoItem, index: number) => {
            let goX: number = 25 - index * 2.4;
            let goY: number = 0;
            let goZ: number = -3;
            if (fast) {
                dominoItem.x = goX;
                dominoItem.y = goY;
                dominoItem.z = goZ;
                dominoItem.setAlpha(true);
                dominoItem.modelScale = .89;
                dominoItem.modelRotationX = 0;
                dominoItem.modelRotationY = Settings3D.corner;
                dominoItem.modelRotationZ = 90;
            } else {
                promises.push(WindowFocusController.wrapTween(TweenMax.to(dominoItem, {
                    duration: .4,
                    delay: index * .1,
                    x: goX,
                    y: goY,
                    z: goZ,
                    alpha: 1,
                    modelRotationX: Settings3D.corner,
                    modelRotationY: 0,
                    modelRotationZ: 180,
                    modelScale: .89,
                    ease: Sine.easeInOut
                })));
            }
        });

        let bottomCounting: DominoItem[] = this.dominoItems.filter(_ => _.pieceData.side == SitPlace.BOTTOM && _.pieceData.place == PiecePlace.WORKSET);
        bottomCounting.sort(this.sortFunction);
        bottomCounting.forEach(item => this.moveToContainer(item, this.showContainer));

        bottomCounting.forEach((dominoItem: DominoItem, index: number) => {
            dominoItem.scoring = true;
            let goX: number = (index - (bottomCounting.length - 1) / 2) * 2.4;
            let goY: number = -5;
            let goZ: number = -3;
            if (fast) {
                dominoItem.x = goX;
                dominoItem.y = goY;
                dominoItem.z = goZ;
                dominoItem.setAlpha(true);
                dominoItem.modelScale = .89;
                dominoItem.modelRotationX = Settings3D.corner;
                dominoItem.modelRotationY = 0;
                dominoItem.modelRotationZ = 180;
            } else {
                promises.push(WindowFocusController.wrapTween(TweenMax.to(dominoItem, {
                    duration: .4,
                    delay: index * .1,
                    x: goX,
                    y: goY,
                    z: goZ,
                    alpha: 1,
                    modelRotationX: Settings3D.corner,
                    modelRotationY: 0,
                    modelRotationZ: 180,
                    modelScale: .89,
                    ease: Sine.easeInOut
                })));
            }
        });

        await Promise.all(promises);
    }

    async clear() {
        let visibleDominoes: DominoItem[] = this.dominoItems.filter(dominoItem => dominoItem.visible);
        visibleDominoes.forEach(dominoItem => {
            dominoItem.z = 0;
            dominoItem.alpha = 0;
            dominoItem.visible = false;
        });
        this.tableContainer.reset();
    }

    resize() {
        this.scale.set(DominoGame.instance.scale3D);
        this.dragContainer.scale.set(DominoGame.instance.scale3D);
        this.myHandContainer.y = -15 / DominoGame.instance.scale3D + 3;
        this.myHandContainer.z = -5;
        this.dragContainerInner.y = -15 / DominoGame.instance.scale3D + 3;
        this.bazarContainer.resize();
        this.setContainerRotations();
    }

    private onTurnChanged(): void {
        this.onPossibleMovesChanged();
    }

    setMyDominoesVisible(visible: boolean) {
        this.dominoItems.filter(dominoItem => dominoItem.pieceData.place == PiecePlace.WORKSET && dominoItem.pieceData.side == SitPlace.BOTTOM).forEach(dominoItem => {
            dominoItem.setAlpha(visible);
        });
    }

    onBazarIconResized(e: MessageEvent): void {
        let bazarIcon: Sprite = e.data;
        this.bazarIconContainer.x = bazarIcon.x / 25.5;
        this.bazarIconContainer.y = bazarIcon.y / 25.5;
    }

    onSitsResized(e: MessageEvent): void {
        let sits: {top: Sit, left: Sit, right: Sit} = e.data;
        this.topHandContainer.x = sits.top.position.x / 25.5;
        this.topHandContainer.y = -sits.top.position.y / 25.5 / Math.sqrt(2);

        this.leftHandContainer.x = sits.left.position.x / 25.5;
        this.leftHandContainer.y = -sits.left.position.y / 25.5 / Math.sqrt(2);

        this.rightHandContainer.x = sits.right.position.x / 25.5;
        this.rightHandContainer.y = -sits.right.position.y / 25.5 / Math.sqrt(2);
    }

    showBazar(show: boolean) {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].forEach(unusedId => {
            let dominoItem: DominoItem = this.dominoItems.find(item => item.pieceData.unusedIdx == unusedId);
            if (dominoItem) {
                if (!show) {
                    dominoItem.setMesh(null);
                    dominoItem.reset();
                    return;
                }
                this.moveToContainer(dominoItem, this.bazarContainer);
                dominoItem.getEmptyMesh();
                dominoItem.setVisible(true);
                dominoItem.setAlpha(this.gameStateData.turn == SitPlace.BOTTOM);
                dominoItem.modelRotationX = -Settings3D.corner;
                dominoItem.modelRotationY = dominoItem.modelRotationZ = 180;
                dominoItem.x = (-3 + unusedId % 7) * 3.6;
                dominoItem.y = (-.82 + Math.floor(unusedId / 7)) * 5.1;
                dominoItem.z = 10;
                dominoItem.modelScale = 1.1;
                dominoItem.setClickable(true);
            }
        });
        this.bazarContainer.show(show);
    }

    createAndAddPoints(score: number, selectorToPlaceAt: Mesh3D): void {
        let points: Mesh3D = DominoesTable.createPoints(score);
        points.z = .2;
        this.tableContainer.addChild(points);

        points.x = selectorToPlaceAt.x;
        points.y = selectorToPlaceAt.y;

        points.rotationQuaternion.setEulerAngles(90, 0, 180);

        this.points.push(points);
    }

    async dealing(): Promise<void> {
        this.resetDominos();
        this.hasSpinner = false;
        this.tableContainer.reset();
        SocketService.afterReconnect || await this.dealingProcess();
    }

    private createSelector(interactive?: boolean, scale: number = 2.2, textureName: string = "table/placement", renderSortType: MaterialRenderSortType = MaterialRenderSortType.opaque): Mesh3D {
        let material = new StandardMaterial();
        material.baseColorTexture = LoaderService.getTexture(textureName);
        material.doubleSided = true;
        material.alphaMode = StandardMaterialAlphaMode.blend;
        material.renderSortType = renderSortType;
        material.unlit = true;
        let selector: Mesh3D = Mesh3D.createPlane(material);
        selector.scale.set(scale);
        if (interactive) {
            selector.interactive = true;
            selector.buttonMode = true;
            selector.on("pointerdown", () => this.onSelectorPointerDown(selector), this);
        }

        return selector;
    }

    private async onDominoPlayed(dominoItem: DominoItem, fast: boolean): Promise<void> {
        if (this.takingFromBazarInProgress) {
            await new Promise(resolve => this.takingFromBazarResolve = resolve);
        }
        this.dominoPlayInProgress = true;
        if (dominoItem.pieceData.side != SitPlace.BOTTOM) {
            let sitContainer: Sprite3D;
            switch (dominoItem.pieceData.side) {
                case SitPlace.TOP:
                    sitContainer = this.topHandContainer;
                    break;
                case SitPlace.LEFT:
                    sitContainer = this.leftHandContainer;
                    break;
                case SitPlace.RIGHT:
                    sitContainer = this.rightHandContainer;
                    break;
            }
            this.moveToContainer(dominoItem, sitContainer);
            dominoItem.x = 0;
            dominoItem.y = 0;
            dominoItem.z = 0;
            dominoItem.modelRotationY = 90;
            dominoItem.modelRotationX = 90;
            dominoItem.modelScale = .5;
            dominoItem.setVisible(true);
            dominoItem.updateTransform();
        }
        this.playDomino(dominoItem, fast);
    }

    private addChildren() {
        this.addChild(this.distributionContainer);
        this.addChild(this.tableContainer);
        this.addChild(this.bazarContainer);
        this.addChild(this.myHandContainer);
        this.addChild(this.bazarIconContainer);
        this.addChild(this.spinnerContainer);
        this.addChild(this.lastInHandContainer);
        this.addChild(this.showContainer);
        this.addChild(this.topHandContainer);
        this.addChild(this.leftHandContainer);
        this.addChild(this.rightHandContainer);
        this.tableContainer.addChild(this.singleNormalSelector);
        this.tableContainer.addChild(this.singleDoubleSelector);
    }

    private onDominoPlaceChanged(e: MessageEvent): void {
        let dominoItem: DominoItem = e.data;
        if (dominoItem.pieceData.shown && dominoItem.pieceData.place == PiecePlace.WORKSET && dominoItem.pieceData.side != SitPlace.BOTTOM) {
            return;
        }

        let mesh: Mesh3D = dominoItem.valuesReady ? DominoLogic.meshes.get(dominoItem.pieceData.bottom).get(dominoItem.pieceData.top) : null;
        let sameItem: boolean = dominoItem.dominoMesh === mesh;
        if (!sameItem && mesh && DominoLogic.getUsed(mesh)) {
            let usingItem: DominoItem = this.dominoItems.find(item => item.dominoMesh === mesh);
            let x: number = usingItem.x;
            let y: number = usingItem.y;
            let z: number = usingItem.z;
            let rx: number = usingItem.modelRotationX;
            let ry: number = usingItem.modelRotationY;
            let rz: number = usingItem.modelRotationZ;
            usingItem.getEmptyMesh(mesh);
            usingItem.x = x;
            usingItem.y = y;
            usingItem.z = z;
            usingItem.modelRotationX = rx;
            usingItem.modelRotationY = ry;
            usingItem.modelRotationZ = rz;
            usingItem.setVisible(true);
        }
        if (!sameItem && mesh) {
            let x: number = dominoItem.x;
            let y: number = dominoItem.y;
            let z: number = dominoItem.z;
            let rx: number = dominoItem.modelRotationX;
            let ry: number = dominoItem.modelRotationY;
            let rz: number = dominoItem.modelRotationZ;
            dominoItem.setMesh(mesh);
            dominoItem.x = x;
            dominoItem.y = y;
            dominoItem.z = z;
            dominoItem.modelRotationX = rx;
            dominoItem.modelRotationY = ry;
            dominoItem.modelRotationZ = rz;
        }
        let fast: boolean = !WindowFocusController.documentVisible || SocketService.afterReconnect;
        switch (dominoItem.pieceData.place) {
            case PiecePlace.PLAYED:
                console.log("PLAYED", dominoItem.top, dominoItem.bottom);
                if (!dominoItem.initial) {
                    this.onDominoPlayed(dominoItem, fast);
                    dispatchEvent(new MessageEvent(GameEvents.DOMINO_PLAYED, {data: this}));
                }
                break;
            case PiecePlace.WORKSET:
                if (ActiveData.gameStateData.phase == GamePhase.DISTRIBUTION) {
                    break;
                }
                if (!dominoItem.initial) {
                    console.log("FROM BAZAR", dominoItem.top, dominoItem.bottom);
                    this.dominoFromBazar(dominoItem, fast);
                    if (fast) {
                        ActiveData.gameStateData.takingUnused = false;
                        ActiveData.dispatchEventsPool();
                    }
                    dispatchEvent(new MessageEvent(GameEvents.DOMINO_FROM_BAZAR, {data: null}));
                }
                break;
        }
    }

    private createChildren() {
        this.singleNormalSelector = this.createSelector();
        this.singleDoubleSelector = this.createSelector();
        this.distributionContainer = new Sprite3D();
        this.myHandContainer = new Sprite3D();
        this.tableContainer = new TableContainer();
        this.bazarContainer = new BazarContainer();
        this.bazarIconContainer = new Sprite3D();
        this.spinnerContainer = new Sprite3D();
        this.lastInHandContainer = new Sprite3D();
        this.showContainer = new Sprite3D();
        this.topHandContainer = new Sprite3D();
        this.leftHandContainer = new Sprite3D();
        this.rightHandContainer = new Sprite3D();
    }

    private async initChildren() {
        this.tableContainer.z = -40;
        this.bazarContainer.z = -30;
        this.bazarContainer.y = 2;
        this.myHandContainer.scale.set(1.2);
        this.dragContainerInner.scale.set(1.2);
        this.setContainerRotations();
        this.singleNormalSelector.z = this.singleDoubleSelector.z = -.1;
        this.singleDoubleSelector.visible = false;
        this.singleNormalSelector.visible = false;
        this.bazarContainer.visible = false;
    }

    getOpenJointsSum(possibleMove: IPossibleMoveData): number {
        if (this.tableDominoes.length <= 1 || !possibleMove.joint) {
            return;
        }

        let joints: IPieceJointData[] = ActiveData.gameStateData.joints.interfaces.filter(joinData => !joinData.additional)
            .map(joint => JSON.parse(JSON.stringify(joint)));
        let points: number[] = joints.map(joint => joint.piece[0] == joint.piece[1] ? joint.value * 2 : joint.value);
        let pointsSum: number = points.length ? points.reduce((acc, cur) => acc + cur) : 0;
        let selectedDominoPoints: number = possibleMove.piece[0] == possibleMove.piece[1] ? possibleMove.piece[0] * 2 : possibleMove.piece.find(number => number != possibleMove.joint?.value);
        let finalPointsSum: number = pointsSum + selectedDominoPoints;
        if (!possibleMove.joint.additional) {
            finalPointsSum -= possibleMove.joint.piece[0] == possibleMove.joint.piece[1] ? possibleMove.joint.joinValue * 2 : possibleMove.joint.joinValue;
        }
        return finalPointsSum;
    }

    private async setPositionOver(coorsAndCorner: CoorsAndCorner, addingData: DominoItem, flyDuration: number, fast: boolean = !WindowFocusController.documentVisible): Promise<void> {
        addingData.setAlpha(true);
        addingData.setVisible(true);
        addingData.moveX = coorsAndCorner.x;
        addingData.moveY = coorsAndCorner.y;
        if (fast) {
            addingData.x = addingData.moveX;
            addingData.y = addingData.moveY;
            addingData.z = 0;
            addingData.modelRotationX = 0;
            addingData.modelRotationY = 0;
            addingData.modelScale = .89;
        } else {
            await WindowFocusController.wrapTween(gsap.to(addingData, flyDuration, {
                x: addingData.moveX,
                y: addingData.moveY,
                z: 0,
                modelRotationX: 0,
                modelRotationY: 0,
                modelScale: .89,
                ease: Sine.easeInOut
            }));
        }
    }

    private async dealingProcess(fast: boolean = !WindowFocusController.documentVisible): Promise<void> {
        let dominoItems: DominoItem[] = this.dominoItems.filter(dominoItem => dominoItem.pieceData.place == PiecePlace.WORKSET && dominoItem.pieceData.side == SitPlace.BOTTOM);
        let otherItems: DominoItem[] = this.dominoItems.filter(dominoItem => dominoItem.pieceData.place != PiecePlace.WORKSET || dominoItem.pieceData.side != SitPlace.BOTTOM);
        dominoItems.forEach(dominoItem => dominoItem.setVisible(false));
        otherItems.forEach(dominoItem => dominoItem.setVisible(false));
        dominoItems.sort(this.sortFunction);
        fast || await Timeout.seconds(1);
        SoundsPlayer.play("distribution");
        if (!fast) {
            let promises: Promise<void>[] = dominoItems.map((dominoItem: DominoItem, index: number) => new Promise<void>(async outerResolve => {
                dominoItem.setVisible(true);
                dominoItem.x = -10;
                dominoItem.y = 0;
                dominoItem.z = 0;
                dominoItem.alpha = 0;
                dominoItem.modelScale = 1.4;
                dominoItem.modelRotationX = 0;
                dominoItem.modelRotationY = 359;
                dominoItem.modelRotationZ = 180;
                dominoItem.directionsOpened = false;
                await Timeout.milliseconds(index * 50);
                let goX0: number = -((index - (dominoItems.length - 1) / 2) * 3.7);
                await WindowFocusController.wrapTween(gsap.to(dominoItem, .3, {
                    x: goX0,
                    modelRotationY: 0,
                    alpha: 1,
                    ease: Sine.easeOut
                }));
                await Timeout.milliseconds(200);
                let goX: number = (index - (dominoItems.length - 1) / 2) * 2.5;
                this.moveToContainer(dominoItem, this.myHandContainer);
                await WindowFocusController.wrapTween(gsap.to(dominoItem, .5, {
                    x: goX,
                    y: 0,
                    z: 0,
                    modelScale: 1,
                    ease: Sine.easeIn
                }));
                outerResolve();
            }));
            await Promise.all(promises);
            return;
        }
        dominoItems.forEach((dominoItem: DominoItem, index: number) => {
            let goX: number = (index - (dominoItems.length - 1) / 2) * 2.5;
            this.moveToContainer(dominoItem, this.myHandContainer);
            dominoItem.x = goX;
            dominoItem.y = 0;
            dominoItem.z = 0;
            dominoItem.modelRotationX = 0;
            dominoItem.modelRotationY = 0;
            dominoItem.modelRotationZ = 180;
            dominoItem.modelScale = 1;
            dominoItem.alpha = 1;
            dominoItem.setVisible(true);
        });
    }

    private onSelectorPointerDown(selector: Mesh3D): void {
        this.selectedDominoItem.makeBigger(false);
        this.clearPoints();
        let move: IPossibleMoveData = this.possibleMoveDataBySelector.get(selector);
        SocketService.optimisticMove(move, this.selectedDominoItem);
        this.hideSelectors();
    }

    private async rotateSpinner(addingData: DominoItem): Promise<void> {
        this.moveToContainer(addingData, this.spinnerContainer);
        addingData.updateTransform();
        await Promise.all([
            WindowFocusController.wrapTween(TweenMax.to(addingData, {duration: .3, modelRotationZ: 0, modelRotationX: -90, modelScale: 1.2, ease: Sine.easeOut})),
            WindowFocusController.wrapTween(TweenMax.to(addingData, {duration: 1, modelRotationY: -380, ease: Sine.easeOut})),
            WindowFocusController.wrapTween(TweenMax.to(addingData, {
                duration: .3, modelRotationY: -360, ease: Sine.easeInOut, delay: 1, onComplete: () => {
                    addingData.modelRotationY = 0;
                }
            })),
            WindowFocusController.wrapTween(TweenMax.to(addingData, {duration: .3, x: 0, y: 2.2, z: -2.2, ease: Sine.easeInOut})),
            WindowFocusController.wrapTween(TweenMax.to(addingData, {duration: .3, innerModelRotationX: 0, innerModelRotationY: 0, ease: Sine.easeOut, delay: 0.5}))
        ]);
    }

    private async rotateLastInHand(addingData: DominoItem): Promise<void> {
        this.moveToContainer(addingData, this.lastInHandContainer);
        addingData.updateTransform();
        await Promise.all([
            WindowFocusController.wrapTween(TweenMax.to(addingData, {duration: .3, modelRotationX: 0, modelRotationZ: 180, modelScale: 1.2, ease: Sine.easeOut})),
            WindowFocusController.wrapTween(TweenMax.to(addingData, {duration: 1, modelRotationY: 380, ease: Sine.easeOut})),
            WindowFocusController.wrapTween(TweenMax.to(addingData, {
                duration: .3, modelRotationY: 360, ease: Sine.easeInOut, delay: 1, onComplete: () => {
                    addingData.modelRotationY = 0;
                }
            })),
            WindowFocusController.wrapTween(TweenMax.to(addingData, {duration: .3, x: 0, y: 2.2, z: -2.2, ease: Sine.easeInOut})),
            WindowFocusController.wrapTween(TweenMax.to(addingData, {duration: .3, innerModelRotationX: 0, innerModelRotationY: 0, ease: Sine.easeOut, delay: 0.5}))
        ]);
    }

    private clearDominoes() {
        let dominoItem: DominoItem;
        while (this.dominoItems.length) {
            dominoItem = this.dominoItems.shift();
            dominoItem.parent.removeChild(dominoItem);
            dominoItem.destroy();
        }
    }

    private moveToContainer(dominoItem: DominoItem, container: Sprite3D) {
        let parent: Sprite3D = dominoItem.parent as Sprite3D;
        if (parent === container) {
            return;
        }
        let containerLocalTransformInverted: Matrix4x4 = new Matrix4x4();
        Matrix4x4.invert(container.localTransform, containerLocalTransformInverted);
        container.addChild(dominoItem);
        dominoItem.localTransform.multiply(parent.localTransform);
        dominoItem.localTransform.multiply(containerLocalTransformInverted);

        //ручной апдейт локальных координат
        dominoItem.x = dominoItem.localTransform.position.x;
        dominoItem.y = dominoItem.localTransform.position.y;
        dominoItem.z = dominoItem.localTransform.position.z;
        dominoItem.modelScale = dominoItem.localTransform.scaling.x;
        dominoItem.rotationQuaternion.setFrom(dominoItem.localTransform.rotation.array);
        let a: {x: number, y: number, z: number} = DominoesTable.ToEulerAngles(dominoItem.rotationQuaternion);
        dominoItem._modelRotationX = a.x;
        dominoItem._modelRotationY = a.y;
        dominoItem._modelRotationZ = a.z;
    }

    private async playDomino(nextDominoItem: DominoItem, fast: boolean = !WindowFocusController.documentVisible): Promise<void> {
        if (nextDominoItem.pieceData.values.interfaces[0] == 0 && nextDominoItem.pieceData.values.interfaces[1] == 6) {
            //debugger;
        }
        nextDominoItem.pieceData.side == SitPlace.BOTTOM && this.inHandReposition(fast);
        nextDominoItem.topDirectionOpened = true;
        nextDominoItem.bottomDirectionOpened = true;
        if (DynamicData.fives && nextDominoItem.double && !this.tableDominoes.some(dominoItem => dominoItem.pieceData.pivot)) {
            nextDominoItem.leftDirectionOpened = true;
            nextDominoItem.rightDirectionOpened = true;
        }

        let inHand: DominoItem[] = this.dominoItems.filter(dominoItem => dominoItem.pieceData.place == PiecePlace.WORKSET && dominoItem.pieceData.side == nextDominoItem.pieceData.side);
        let lastInHand: boolean = !inHand.length;
        lastInHand && dispatchEvent(new MessageEvent(GameEvents.DOMINO, {data: nextDominoItem.pieceData.side}));

        let joint: PieceJointData = nextDominoItem.pieceData.joint.value != -1 ? nextDominoItem.pieceData.joint : null;
        let prevDominoItem: DominoItem = joint ? this.getDominoItemByNumbers([joint.piece.getAt(0).value, joint.piece.getAt(1).value]) : null;
        let positionDirectionDirectionTurn: PositionDirectionDirectionTurn = DominoCalculator.getPositionDirectionDirectionTurn(joint?.config, prevDominoItem, nextDominoItem, this.tableDominoes, DynamicData.socketGameRequest.mode);
        if (joint) {
            prevDominoItem = this.getDominoItemByNumbers([joint.piece.getAt(0).value, joint.piece.getAt(1).value]);
            if (prevDominoItem.double || !nextDominoItem.double) {
                nextDominoItem.top == joint.joinValue && nextDominoItem.swap();
            }
            switch (positionDirectionDirectionTurn.direction) {
                case Direction.RIGHT:
                    prevDominoItem.rightDirectionOpened = false;
                    break;
                case Direction.LEFT:
                    prevDominoItem.leftDirectionOpened = false;
                    break;
                case Direction.UP:
                    prevDominoItem.topDirectionOpened = false;
                    break;
                case Direction.DOWN:
                    prevDominoItem.bottomDirectionOpened = false;
                    break;
            }
        }
        let coorsAndCorner: CoorsAndCorner = DominoCalculator.getCoorsAndCorner(nextDominoItem, prevDominoItem, positionDirectionDirectionTurn);
        await this.addDomino(prevDominoItem, nextDominoItem, coorsAndCorner, fast, lastInHand);
        fast || SoundsPlayer.playPutSound();
        nextDominoItem.placed = true;
        fast || await this.flyPoints(nextDominoItem);
        let minX: number = 1000;
        let maxX: number = -1000;
        let minY: number = 1000;
        let maxY: number = -1000;
        this.placedDominoes.forEach(dominoItem => {
            let dominoVertical: boolean = (!dominoItem.double && [Direction.LEFT, Direction.RIGHT].includes(dominoItem.moveDirection) || (dominoItem.double && [Direction.UP, Direction.DOWN].includes(dominoItem.moveDirection)));
            let addingX: number = dominoVertical ? 1 : 2;
            let addingY: number = dominoVertical ? 2 : 1;
            minX = Math.min(minX, dominoItem.x - addingX);
            maxX = Math.max(maxX, dominoItem.x + addingX);
            minY = Math.min(minY, dominoItem.y - addingY);
            maxY = Math.max(maxY, dominoItem.y + addingY);
        });
        lastInHand || await this.tableContainer.move(minX, maxX, minY, maxY, fast);
        if (this._destroyed) {
            return;
        }
        let targetScore: number = StaticData.getCurrentGameConfig().targetScore;
        if (DynamicData.socketGameRequest.mode == GameMode.FIVES && this.gameStateData.playersSlots.asArray().some(playerData => playerData.moveScore >= targetScore)) {
            dispatchEvent(new MessageEvent(GameEvents.TARGET_REACHED, {data: null}));
        }
        this.dominoPlayInProgress = false;
        this.dominoPlayCompleteResolve && this.dominoPlayCompleteResolve();
        this.dominoPlayCompleteResolve = undefined;
    }

    private async flyPoints(addingData: DominoItem) {
        if (!DynamicData.fives) {
            return;
        }
        let score: number = addingData.pieceData.score;
        if (!score) {
            return;
        }
        await new Promise(resolve => dispatchEvent(new MessageEvent(GameEvents.FLY_POINTS, {
            data: {
                side: addingData.pieceData.side,
                score,
                callback: resolve,
                lastPlayedDomino: addingData
            }
        })));
    }

    private showClosestTableJointButtons(dominoItem: DominoItem) {
        if (!this.tableDominoes.length) {
            this.closestPossibleMoveData = this.gameStateData.possibleMoves?.interfaces
                .find(possibleMove =>
                    possibleMove.piece[0] == dominoItem.pieceData.values.interfaces[0] &&
                    possibleMove.piece[1] == dominoItem.pieceData.values.interfaces[1]);
            return;
        }
        let closestDistance: number = 1000;
        let closestSelector: Mesh3D = null;
        this.selectors.filter(_ => _.visible).forEach(selector => {
            let curDistance: number = Math.sqrt(Math.pow(selector.worldTransform.position.x - dominoItem.worldTransform.position.x, 2) + Math.pow(selector.worldTransform.position.y - dominoItem.worldTransform.position.y, 2));
            if (curDistance < closestDistance) {
                closestDistance = curDistance;
                closestSelector = selector;
            }
            selector.alpha = .2;
        });

        if (closestSelector) {
            closestSelector.alpha = 1;
            this.closestPossibleMoveData = this.possibleMoveDataBySelector.get(closestSelector);
        }
    }

    private hideOnTableJointButtons() {
        if (!this.tableDominoes.length) {
            this.showSingleJoint(undefined, false);
            return;
        }

        this.hideSelectors();
        this.clearPoints();
    }

    private setTableJointButtons(nextDominoItem: DominoItem) {
        if (!this.tableDominoes.length) {
            this.showSingleJoint(nextDominoItem);
            return;
        }
        let prevDominoItem: DominoItem;
        this.gameStateData.possibleMoves?.interfaces
            .filter(possibleMove =>
                possibleMove.piece[0] == nextDominoItem.pieceData.values.interfaces[0] &&
                possibleMove.piece[1] == nextDominoItem.pieceData.values.interfaces[1])
            .filter(possibleMove => possibleMove.joint?.piece)
            .forEach((possibleMove: IPossibleMoveData, index: number) => {
                prevDominoItem = this.getDominoItemByNumbers(possibleMove.joint.piece);
                let positionDirectionDirectionTurn: PositionDirectionDirectionTurn = DominoCalculator.getPositionDirectionDirectionTurn(possibleMove.joint, prevDominoItem, nextDominoItem, this.tableDominoes, DynamicData.socketGameRequest.mode);
                let coorsAndCorner: CoorsAndCorner = DominoCalculator.getCoorsAndCorner(nextDominoItem, prevDominoItem, positionDirectionDirectionTurn);
                let selector: Mesh3D = this.selectors[index];
                selector.visible = true;
                this.possibleMoveDataBySelector.set(selector, possibleMove);
                selector.x = coorsAndCorner.x;
                selector.y = coorsAndCorner.y;
                selector.z = -.26;
                let angle: number = coorsAndCorner.getAddingAngle();
                let normalVector: Vector = new Vector(0, -1);
                DominoItem.rotateVector(normalVector, angle);
                selector.rotationQuaternion.setEulerAngles(90, 0, DominoItem.getRotationZ(nextDominoItem.double, normalVector, false));
                DynamicData.fives && this.createAndAddPoints(possibleMove.score, selector);
                let highlight: Mesh3D;
                if (prevDominoItem.double) {
                    highlight = this.highlights_double[index];
                    highlight.visible = true;
                    highlight.x = prevDominoItem.x;
                    highlight.y = prevDominoItem.y;
                    highlight.z = .38;
                    highlight.rotationQuaternion.setEulerAngles(90, 0, DominoItem.getRotationZ(prevDominoItem.double, prevDominoItem.normalVector, false));
                } else {
                    highlight = this.highlights[index];
                    highlight.visible = true;
                    highlight.x = prevDominoItem.x + (possibleMove.joint.joinValue == prevDominoItem.top ? prevDominoItem.normalVector.x : -prevDominoItem.normalVector.x);
                    highlight.y = prevDominoItem.y + prevDominoItem.normalVector.y;
                    highlight.z = .38;
                    highlight.rotationQuaternion.setEulerAngles(90, 0, 0);
                }
                this.possibleMoveDataBySelector.set(highlight, possibleMove);
            });
    }

    private showSingleJoint(selectedDominoItem: DominoItem, show: boolean = true) {
        this.destroySinglePoints();
        this.singleDoubleSelector.visible = this.singleNormalSelector.visible = false;

        if (!show) {
            return;
        }
        let currentSelector: Mesh3D = selectedDominoItem.double ? this.singleDoubleSelector : this.singleNormalSelector;
        currentSelector.visible = true;
        if (!DynamicData.fives) {
            return;
        }
        let possibleMove: IPossibleMoveData = ActiveData.gameStateData.possibleMoves.interfaces.find(possibleMoves => selectedDominoItem.bottom == possibleMoves.piece[0] && selectedDominoItem.top == possibleMoves.piece[1]);
        this.singlePoints = DominoesTable.createPoints(possibleMove.score);
        this.singlePoints.rotationQuaternion.setEulerAngles(180 - Settings3D.corner, 0, 180);
        this.singlePoints.y = .6;
        this.singlePoints.z = 1.1;
        this.tableContainer.addChild(this.singlePoints);
    }

    private destroySinglePoints() {
        this.tableContainer.removeChild(this.singlePoints);
        this.singlePoints?.destroy();
        this.singlePoints = undefined;
    }

    private setContainerRotations() {
        this.distributionContainer.rotationQuaternion.setEulerAngles(Settings3D.corner, 0, 0);
        this.myHandContainer.rotationQuaternion.setEulerAngles(Settings3D.corner, 0, 0);
        this.spinnerContainer.rotationQuaternion.setEulerAngles(90 - Settings3D.corner, 0, 0);
        this.lastInHandContainer.rotationQuaternion.setEulerAngles(Settings3D.corner, 0, 0);
        this.dragContainerInner.rotationQuaternion.setEulerAngles(Settings3D.corner, 0, 0);
        this.tableContainer.rotationQuaternion.setEulerAngles(Settings3D.corner, 0, 180);
        this.singleDoubleSelector.rotationQuaternion.setEulerAngles(90, 0, 0);
        this.singleNormalSelector.rotationQuaternion.setEulerAngles(90, 90 - Settings3D.corner, 90);
    }

    // static getMaxWidthAndHeight(): Point {
    //     return DynamicData.socketGameRequest.mode == GameMode.PRO ? new Point(37, 11) : new Point(40, 9);
    // }

    // private getCoorsAndCorner(nextDominoItem: DominoItem, prevDominoItem: DominoItem, positionDirectionDirectionTurn: PositionDirectionDirectionTurn): CoorsAndCorner {
    //     let direction: Direction = positionDirectionDirectionTurn.direction;
    //     if (prevDominoItem) {
    //         if (positionDirectionDirectionTurn.directionTurn != Direction.NONE) {
    //             direction = DominoLogic.directionsSum(positionDirectionDirectionTurn.directionTurn, direction);
    //         }
    //         let directionsSum: Direction = DominoLogic.directionsSum(prevDominoItem.moveDirection, direction);
    //         let finalDirectionVector: Vector = prevDominoItem.getDirectionVectorOld(positionDirectionDirectionTurn.position, direction, nextDominoItem.double).add(new Vector(prevDominoItem.moveX, prevDominoItem.moveY));
    //         return new CoorsAndCorner(finalDirectionVector.x, finalDirectionVector.y, directionsSum);
    //     }
    //     return new CoorsAndCorner(0, 0, Direction.UP);
    // }

    // private getPositionDirectionDirectionTurn(joint: IPieceJointData, nextDominoItem: DominoItem): PositionDirectionDirectionTurn {
    //     let direction: Direction;
    //     let directionTurn: DirectionTurn = Direction.NONE;
    //     let position: Position;
    //     if (joint) {
    //         let prevDominoItem: DominoItem = this.getDominoItemByNumbers([joint.piece[0], joint.piece[1]]);
    //         if (prevDominoItem.double) {
    //             if (this.tableDominoes.length == 1) {
    //                 switch (joint.dir) {
    //                     case PieceRot.RIGHT:
    //                         direction = Direction.UP;
    //                         break;
    //                     case PieceRot.LEFT:
    //                         direction = Direction.DOWN;
    //                         break;
    //                 }
    //             } else {
    //                 if (joint.additional) {
    //                     direction = joint.dir == PieceRot.DOWN ? Direction.RIGHT : Direction.LEFT;
    //                 } else {
    //                     direction = prevDominoItem.topDirectionOpened ? Direction.UP : Direction.DOWN;
    //                 }
    //
    //             }
    //         } else {
    //             switch (this.dominoItems.filter(dominoItem => dominoItem.onTable).length) {
    //                 case 0:
    //                     direction = Direction.UP;
    //                     break;
    //                 default:
    //                     direction = prevDominoItem.top == joint.joinValue ? Direction.UP : Direction.DOWN;
    //                     break;
    //             }
    //         }
    //
    //         directionTurn = this.getDirectionTurn(prevDominoItem, nextDominoItem);
    //         position = prevDominoItem.double ? Position.CENTER : direction == Direction.DOWN ? Position.BOTTOM : Position.TOP;
    //     }
    //
    //     return new PositionDirectionDirectionTurn(position, direction, directionTurn);
    // }

    private clearSelectors() {
        let selector: Mesh3D;
        while (this.selectors.length) {
            selector = this.selectors.shift();
            selector.hitArea = undefined;
            this.tableContainer.removeChild(selector);
            selector.removeAllListeners("pointerdown");
            selector.destroy({geometry: true});
        }
    }

    private clearHighLights() {
        let highlight: Mesh3D;
        while (this.highlights.length) {
            highlight = this.highlights.shift();
            highlight.hitArea = undefined;
            this.tableContainer.removeChild(highlight);
            highlight.removeAllListeners("pointerdown");
            highlight.destroy({geometry: true});
        }
        while (this.highlights_double.length) {
            highlight = this.highlights_double.shift();
            highlight.hitArea = undefined;
            this.tableContainer.removeChild(highlight);
            highlight.removeAllListeners("pointerdown");
            highlight.destroy({geometry: true});
        }
    }

    private hideSelectors() {
        this.selectors.forEach(selector => selector.visible = false);
        this.highlights.forEach(selector => selector.visible = false);
        this.highlights_double.forEach(selector => selector.visible = false);
        this.possibleMoveDataBySelector.clear();
    }

    // private getDirectionTurn(prevDominoItem: DominoItem, nextDominoItem: DominoItem): DirectionTurn {
    //     let minX: number = 0;
    //     let maxX: number = 0;
    //     let minY: number = 0;
    //     let maxY: number = 0;
    //     this.tableDominoes.forEach(dominoItem => {
    //         minX = Math.min(minX, dominoItem.x);
    //         maxX = Math.max(maxX, dominoItem.x);
    //         minY = Math.min(minY, dominoItem.y);
    //         maxY = Math.max(maxY, dominoItem.y);
    //     });
    //
    //     if (!nextDominoItem.double) {
    //         if (DynamicData.fives) {
    //             let spinner: DominoItem = this.tableDominoes.find(tableDomino => tableDomino.pieceData.pivot);
    //             if (spinner) {
    //                 if (Math.abs(prevDominoItem.x - spinner.x) < .1) {
    //                     if (prevDominoItem.y < -3) {
    //                         return Math.abs(spinner.x - minX) < Math.abs(spinner.x - maxX) ? Direction.RIGHT : Direction.LEFT;
    //                     }
    //                     if (prevDominoItem.y > 3) {
    //                         return Math.abs(spinner.x - minX) < Math.abs(spinner.x - maxX) ? Direction.LEFT : Direction.RIGHT;
    //                     }
    //                 }
    //             }
    //         } else {
    //             let maxWidthAndHeight: Point = DominoesTable.getMaxWidthAndHeight();
    //             if (maxX - minX > maxWidthAndHeight.x) {
    //                 if (Math.abs(prevDominoItem.y) < .1) {
    //                     return prevDominoItem.x >= 0 ? Direction.LEFT : Direction.RIGHT;
    //                 }
    //                 if (prevDominoItem.y < -maxWidthAndHeight.y) {
    //                     if (prevDominoItem.x == maxX) {
    //                         return Direction.LEFT;
    //                     }
    //                     if (prevDominoItem.x == minX) {
    //                         return Direction.RIGHT;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return Direction.NONE;
    // }

    private onPossibleMovesChanged(): void {
        this.dominoItems.filter(dominoItem => dominoItem.pieceData.place == PiecePlace.WORKSET && dominoItem.pieceData.side == SitPlace.BOTTOM).forEach(dominoItem => {
            dominoItem.setAlpha(false);
            dominoItem.setClickable(false);
        });
        this.hideOnTableJointButtons();
        if (this.gameStateData.turn == SitPlace.BOTTOM) {
            this.setClickableDominoes();
        } else {
            this.setMyDominoesVisible(!this.gameStateData.takingUnused);
        }
    }
}