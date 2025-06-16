import gsap from "gsap";
import {Sine, TweenMax} from "gsap/gsap-core";
import {Container, Filter, InteractionEvent, Point} from "pixi.js";
import {Camera, Mesh3D, PickingHitArea, Sprite3D} from "pixi3d";
import {DominoGame} from "../../../../../app";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {IPoint} from "@azur-games/pixi-vip-framework";
import {ArrayWrapEvent} from "../../../../../data/active_data/base/static_config_data/array_wrap/ArrayWrapEvent";
import {PieceData, PieceDataEvent} from "../../../../../data/active_data/game_state/PieceData";
import {ActiveData} from "../../../../../data/ActiveData";
import {PieceRot} from "../../../../../dynamic_data/IPieceData";
import {IPossibleMoveData} from "../../../../../dynamic_data/IPossibleMoveData";
import {MoveAction} from "../../../../../dynamic_data/MoveAction";
import {PiecePlace} from "../../../../../dynamic_data/PiecePlace";
import {SitPlace} from "../../../../../dynamic_data/SitPlace";
import {GameEvents} from "../../../../../GameEvents";
import {SocketService} from "../../../../../services/SocketService";
import {Settings3D} from "../../../../../utils/Settings3D";
import {DominoLogic} from "../DominoLogic";
import {CoorsAndCorner} from "./CoorsAndCorner";
import {Direction} from "./Direction";
import {PositionDirectionPairs} from "./domino_item/PositionDirectionPairs";
import {SingleDoubleVector} from "./domino_item/SingleDoubleVector";
import {DominoNumber} from "./DominoNumber";
import {Position} from "./Position";
import {Vector} from "./Vector";


export class DominoItem extends Sprite3D {
    dominoMesh: Mesh3D;
    normalVector: Vector;
    topTopVector: Vector;
    topLeftVector: Vector;
    topRightVector: Vector;
    centerLeftVector: Vector;
    centerRightVector: Vector;
    bottomBottomVector: Vector;
    bottomLeftVector: Vector;
    bottomRightVector: Vector;
    topTopDoubleVector: Vector;
    centerLeftDoubleVector: Vector;
    centerRightDoubleVector: Vector;
    bottomBottomDoubleVector: Vector;

    doubleTopVector: Vector;
    doubleLeftVector: Vector;
    doubleRightVector: Vector;
    doubleBottomVector: Vector;

    _topDirectionOpened: boolean = false;
    _bottomDirectionOpened: boolean = false;
    _leftDirectionOpened: boolean = false;
    _rightDirectionOpened: boolean = false;

    moveX: number = 0;
    moveY: number = 0;
    swapped: boolean;
    static filter: Filter;

    jointsVectors: Map<Position, Map<Direction, SingleDoubleVector>> = new Map<Position, Map<Direction, SingleDoubleVector>>();
    doubleJointsVectors: Map<Direction, Vector> = new Map<Direction, Vector>();
    pieceRot: PieceRot = PieceRot.RIGHT;

    onTable: boolean;
    placed: boolean;
    initial: boolean;
    scoring: boolean = false;

    _modelRotationX: number = 0;
    _modelRotationY: number = 0;
    _modelRotationZ: number = 0;
    moveDirection: Direction;
    modelContainer: Sprite3D;
    dragged: boolean;
    draggingOverTable: boolean;
    draggingOverHand: boolean;
    protected pointerStartOffset: IPoint = {x: 0, y: 0};
    protected movePosition: Point = new Point();
    private root: Container;
    private startPosition: Point = new Point();
    private scaleTween: TweenMax;
    private alphaTween: gsap.core.Tween;

    constructor(public pieceData: PieceData) {
        super();

        this.modelContainer = new Sprite3D();

        this.addChild(this.modelContainer);

        this.leftDirectionOpened = false;
        this.rightDirectionOpened = false;
        this.topDirectionOpened = false;
        this.bottomDirectionOpened = false;

        PositionDirectionPairs.values.forEach(pair => {
            this.jointsVectors.has(pair.position) || this.jointsVectors.set(pair.position, new Map<Direction, SingleDoubleVector>);
            this.jointsVectors.get(pair.position).set(pair.direction, this.createSingleDoubleVector());
        });

        this.doubleJointsVectors.set(Direction.UP, new Vector(0, -4));
        this.doubleJointsVectors.set(Direction.DOWN, new Vector(0, 4));
        this.doubleJointsVectors.set(Direction.RIGHT, new Vector(3, 0));
        this.doubleJointsVectors.set(Direction.LEFT, new Vector(-3, 0));

        this.pieceData.addListener(PieceDataEvent.PLACE_CHANGED, this.onPlaceChanged, this);
        this.pieceData.addListener(PieceDataEvent.SHOWN_CHANGED, this.onShownChanged, this);
        this.pieceData.values.addListener(ArrayWrapEvent.ELEMENT_REMOVED, this.onValueRemoved, this);

        this.root = DominoGame.instance.app.stage;
        this.root.interactive = this.root.interactiveChildren = true;
    }

    _innerModelRotationX: number = 0;

    get innerModelRotationX(): number {
        return this._innerModelRotationX;
    }

    set innerModelRotationX(value) {
        this._innerModelRotationX = value;
        this.updateInnerModelQuaternion();
    }

    set modelScale(value) {
        this._modelScale = value;
        this.scale.set(value);
    }

    get topDirectionOpened(): boolean {
        return this._topDirectionOpened;
    }

    set topDirectionOpened(value: boolean) {
        this._topDirectionOpened = value;
    }

    get top(): DominoNumber {
        return this.pieceData?.values.getAt(this.swapped ? 0 : 1)?.value as DominoNumber;
    }

    get bottom(): DominoNumber {
        return this.pieceData?.values.getAt(this.swapped ? 1 : 0)?.value as DominoNumber;
    }

    get bottomDirectionOpened(): boolean {
        return this._bottomDirectionOpened;
    }

    set bottomDirectionOpened(value: boolean) {
        this._bottomDirectionOpened = value;
    }

    set leftDirectionOpened(value: boolean) {
        this._leftDirectionOpened = value;
    }

    get leftDirectionOpened(): boolean {
        return this._leftDirectionOpened;
    }

    set rightDirectionOpened(value: boolean) {
        this._rightDirectionOpened = value;
    }

    get rightDirectionOpened(): boolean {
        return this._rightDirectionOpened;
    }

    get double(): boolean {
        return this.top == this.bottom;
    }

    get modelRotationX(): number {
        return this._modelRotationX;
    }

    set modelRotationX(value) {
        this._modelRotationX = value;
        this.updateModelQuaternion();
    }

    get modelRotationY(): number {
        return this._modelRotationY;
    }

    set modelRotationY(value) {
        this._modelRotationY = value;
        this.updateModelQuaternion();
    }

    get modelRotationZ(): number {
        return this._modelRotationZ;
    }

    set modelRotationZ(value) {
        this._modelRotationZ = value;
        this.updateModelQuaternion();
    }

    _innerModelRotationY: number = 0;

    get innerModelRotationY(): number {
        return this._innerModelRotationY;
    }

    set innerModelRotationY(value) {
        this._innerModelRotationY = value;
        this.updateInnerModelQuaternion();
    }

    _innerModelRotationZ: number = 0;

    get innerModelRotationZ(): number {
        return this._innerModelRotationZ;
    }

    set innerModelRotationZ(value) {
        this._innerModelRotationZ = value;
        this.updateInnerModelQuaternion();
    }

    private _modelScale: number = 1;

    get modelScale(): number {
        return this._modelScale;
    }

    get valuesReady(): boolean {
        return this.pieceData.values.length == 2 && this.pieceData.values.getAt(0).value > -1 && this.pieceData.values.getAt(1).value > -1;

    }

    static rotateVector(vector: Vector, addingAngle: number): void {
        vector.setDirection(vector.getDirection() + addingAngle);
    }

    set directionsOpened(value: boolean) {
        this.topDirectionOpened = value;
        this.bottomDirectionOpened = value;
        this.leftDirectionOpened = value;
        this.rightDirectionOpened = value;
    }

    /*    getDirectionVector(direction: Direction, nextDouble: boolean) {
            let position: Position;
            switch (direction) {
                case Direction.RIGHT:
                    position = Position.RIGHT;
                    break;
                case Direction.LEFT:
                    position = Position.LEFT;
                    break;
                case Direction.UP:
                    position = this.double ? Position.CENTER : Position.RIGHT;
                    break;
                case Direction.DOWN:
                    position = this.double ? Position.CENTER : Position.RIGHT;
                    break;
            }
            return this.double
                ? this.doubleJointsVectors.get(direction)
                : (nextDouble
                    ? this.jointsVectors.get(position).get(direction).double
                    : this.jointsVectors.get(position).get(direction).single);
        }*/

    private onDominoPointerOver(e: InteractionEvent): void {
        //this.dominoModel.alpha = .3;
    }

    private onDominoPointerOut(e: InteractionEvent): void {
        //this.dominoModel.alpha = 1;
    }

    swap() {
        this.swapped = true;
    }

    setAlpha(value: boolean): void {
        this.alphaTween?.kill();
        this.alphaTween = TweenMax.to(this, {duration: .1, alpha: value ? 1 : .5});
    }

    public init(): void {
        this.resetVectors();
        this.initial = true;
        this.onPlaceChanged();
        this.initial = false;
    }

    setClickable(value: boolean) {
        if (!this.dominoMesh) {
            return;
        }
        this.dominoMesh.interactive = this.dominoMesh.interactiveChildren = value;
    }

    static getRotationZ(double: boolean, normalVector: Vector, swapped: boolean): number {
        return (double ? 0 : 90) + (Math.atan2(normalVector.y, normalVector.x) / Math.PI * 180) + (swapped ? 180 : 0);
    }

    async setRotation(goRotationZ: number, fast: boolean = !WindowFocusController.documentVisible, flyDuration: number): Promise<void> {
        if (fast) {
            this.modelRotationZ = goRotationZ;
        } else {
            if (this.modelRotationZ - goRotationZ) {
                await WindowFocusController.wrapTween(TweenMax.to(this, flyDuration, {
                    modelRotationZ: goRotationZ,
                    ease: Sine.easeInOut
                }));
            }

        }
    }

    destroy() {
        this.alphaTween?.kill();

        this.pieceData.values.removeListener(ArrayWrapEvent.ELEMENT_REMOVED, this.onValueRemoved, this);
        this.pieceData.removeListener(PieceDataEvent.PLACE_CHANGED, this.onPlaceChanged, this);
        this.pieceData.removeListener(PieceDataEvent.SHOWN_CHANGED, this.onShownChanged, this);

        this.tryRemoveMesh();

        this.removeChild(this.modelContainer);

        this.modelContainer.destroy();

        this.modelContainer = undefined;

        this.pieceData = null;
        super.destroy();
    }

    reset() {
        this.pieceRot = PieceRot.RIGHT;
        this.scoring = false;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.swapped = false;
        this.placed = false;
        this.onTable = false;
        if (!this.dominoMesh) {
            return;
        }
        this.modelRotationX = 0;
        this.modelRotationY = 0;
        this.modelRotationZ = 0;
        this.innerModelRotationX = 0;
        this.innerModelRotationY = 0;
        this.innerModelRotationZ = 0;
        this.setVisible(false);
        this.setClickable(false);
    }

    getDirectionVectorOld(position: Position, direction: Direction, nextDouble: boolean) {
        switch (position) {
            case Position.TOP:
                switch (direction) {
                    case Direction.RIGHT:
                        return this.topRightVector;
                    case Direction.LEFT:
                        return this.topLeftVector;
                    case Direction.UP:
                        return this.double ? this.doubleTopVector : (nextDouble ? this.topTopDoubleVector : this.topTopVector);
                }
            case Position.BOTTOM:
                switch (direction) {
                    case Direction.RIGHT:
                        return this.bottomRightVector;
                    case Direction.LEFT:
                        return this.bottomLeftVector;
                    case Direction.DOWN:
                        return this.double ? this.doubleBottomVector : (nextDouble ? this.bottomBottomDoubleVector : this.bottomBottomVector);
                }
            case Position.CENTER:
                switch (direction) {
                    case Direction.RIGHT:
                        return this.double ? this.doubleRightVector : (nextDouble ? this.centerRightDoubleVector : this.centerRightVector);
                    case Direction.LEFT:
                        return this.double ? this.doubleLeftVector : (nextDouble ? this.centerLeftDoubleVector : this.centerLeftVector);
                    case Direction.UP:
                        return this.double ? this.doubleTopVector : this.topTopVector;
                    case Direction.DOWN:
                        return this.double ? this.doubleBottomVector : this.bottomBottomVector;
                }
        }
    }

    tryRemoveMesh() {
        if (this.dominoMesh) {
            this.modelContainer.removeChild(this.dominoMesh);
            DominoLogic.setUsed(this.dominoMesh, false);
            this.dominoMesh.removeAllListeners("pointerdown");
            this.dominoMesh.hitArea = null;
            this.dominoMesh = null;
        }
    }

    private createSingleDoubleVector(): SingleDoubleVector {
        return {single: new Vector(0, 0), double: new Vector(0, 0)};
    }

    setVisible(value: boolean): void {
        this.visible = value;
        if (this.dominoMesh) {
            this.dominoMesh.hitArea = value ? new PickingHitArea(this.dominoMesh) : null;
        }
    }

    makeBigger(value: boolean) {
        let mul: number = value ? 1.1 : 1;
        this.scaleTween?.kill();
        this.scaleTween = TweenMax.to(this.dominoMesh.scale, {x: mul, y: mul, z: mul, duration: .2, ease: Sine.easeInOut});
    }

    getEmptyMesh(butMesh: Mesh3D = null) {
        let mesh: Mesh3D = DominoLogic.model.meshes.find(mesh => !DominoLogic.getUsed(mesh) && mesh !== butMesh);
        this.setMesh(mesh);
    }

    setMesh(mesh3D: Mesh3D) {
        if (this.dominoMesh === mesh3D) {
            return;
        }
        this.tryRemoveMesh();
        if (!mesh3D) {
            return;
        }
        DominoLogic.setUsed(mesh3D);
        this.dominoMesh = mesh3D;
        this.dominoMesh.buttonMode = true;
        this.modelContainer.addChild(this.dominoMesh);
        this.updateTransform();
        mesh3D.interactive = mesh3D.interactiveChildren = true;
        this.dominoMesh.hitArea = new PickingHitArea(this.dominoMesh);
        mesh3D.on("pointerdown", this.onDominoPointerDown, this);
    }

    onDragMove(e: InteractionEvent): void {
        this.movePosition = Camera.main.screenToWorld(e.data.global.x, e.data.global.y, 0);
        this.movePosition.x /= DominoGame.instance.scale3D;
        this.movePosition.y *= Settings3D.cosCorner / DominoGame.instance.scale3D;
        this.movePosition.y += this.z * Settings3D.sinCorner * Settings3D.cosCorner;
        this.tryMove();
        dispatchEvent(new MessageEvent(GameEvents.DOMINO_DRAGGING, {data: this}));
    }

    onPointerUp(e: InteractionEvent): void {
        this.disableStageListeningDrag();
        this.dominoClicked();
        this.draggingOverHand = false;
        this.draggingOverTable = false;
        this.dragged = false;
    }

    private updateModelQuaternion() {
        this.rotationQuaternion.setEulerAngles(this._modelRotationX, this._modelRotationY, this._modelRotationZ);
    }

    private onValueRemoved() {
        this.valuesReady || this.setMesh(null);
    }

    private onShownChanged() {
        this.setMesh(this.valuesReady ? DominoLogic.meshes.get(this.pieceData.bottom).get(this.pieceData.top) : null);
        this.setVisible(this.pieceData.side == SitPlace.BOTTOM);
    }

    private resetVectors(): void {
        let a1: number = 1;
        let a2: number = a1 * 2;
        let a3: number = a1 * 3;
        let a4: number = a1 * 4;

        this.normalVector = new Vector(0, -a1);
        this.topTopDoubleVector = new Vector(0, -a3);
        this.centerLeftDoubleVector = new Vector(-a2, 0);
        this.centerRightDoubleVector = new Vector(a2, 0);
        this.bottomBottomDoubleVector = new Vector(0, a3);
        this.topLeftVector = new Vector(-a3, -a1);
        this.topTopVector = new Vector(0, -a4);
        this.topRightVector = new Vector(a3, -a1);
        this.centerLeftVector = new Vector(-a3, 0);
        this.centerRightVector = new Vector(a3, 0);
        this.bottomLeftVector = new Vector(-a3, a1);
        this.bottomBottomVector = new Vector(0, a4);
        this.bottomRightVector = new Vector(a3, a1);

        this.doubleTopVector = new Vector(0, -a3);
        this.doubleBottomVector = new Vector(0, a3);
        this.doubleLeftVector = new Vector(-a4, 0);
        this.doubleRightVector = new Vector(a4, 0);
    }

    private onPlaceChanged() {
        dispatchEvent(new MessageEvent(GameEvents.DOMINO_PLACE_CHANGED, {data: this}));
    }

    private updateInnerModelQuaternion() {
        this.modelContainer.rotationQuaternion.setEulerAngles(this._innerModelRotationX, this._innerModelRotationY, this._innerModelRotationZ);
    }

    /**
     * Применяем новые координаты мыши
     */
    tryMove(): void {
        let newX: number = this.movePosition.x + this.pointerStartOffset.x;
        let newY: number = this.movePosition.y + this.pointerStartOffset.y;

        if (Math.abs(newX - this.startPosition.x) > .3 || Math.abs(newY - this.startPosition.y) > .3) {
            this.dragged = true;
        }

        this.x = newX;
        this.y = newY;
        this.z = -newY * Settings3D.tgCorner;
    }

    private onDominoPointerDown(e: InteractionEvent): void {
        if (this.onTable || !ActiveData.gameStateData) {
            return;
        }
        if (ActiveData.gameStateData.takingUnused && ![null, -1].includes(this.pieceData.unusedIdx)) {
            let move: IPossibleMoveData = ActiveData.gameStateData.possibleMoves.interfaces.find(move => move.action == MoveAction.TAKE && move.unusedIdx == this.pieceData.unusedIdx);
            SocketService.move(move);
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.DOMINO_POINTERDOWN, {data: this}));
        this.startPosition.x = this.x;
        this.startPosition.y = this.y;
        this.draggingOverHand = true;
        this.draggingOverTable = false;
        let clickPosition = Camera.main.screenToWorld(e.data.global.x, e.data.global.y, 0);
        clickPosition.x /= DominoGame.instance.scale3D;
        clickPosition.y *= Settings3D.cosCorner / DominoGame.instance.scale3D;
        clickPosition.y += this.z * Settings3D.sinCorner * Settings3D.cosCorner;

        this.pointerStartOffset = {x: this.x - clickPosition.x, y: this.y - clickPosition.y};
        this.root.on('pointermove', this.onDragMove, this);
        this.root.on('pointerup', this.onPointerUp, this);
        this.root.on('pointerupoutside', this.onPointerUp, this);
    }

    protected disableStageListeningDrag(): void {
        this.root.off('pointerup', this.onPointerUp, this);
        this.root.off('pointermove', this.onDragMove, this);
        this.root.off('pointerupoutside', this.onPointerUp, this);
    }

    private dominoClicked(): void {
        if ((this.pieceData.side != SitPlace.BOTTOM || this.pieceData.place != PiecePlace.WORKSET)) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.DOMINO_CLICKED, {data: this}));
    }

    setMoveDirection(direction: Direction) {
        this.moveDirection = direction;
    }

    rotateVectors(coorsAndCorner: CoorsAndCorner) {
        this.resetVectors();
        let addingAngle: number = coorsAndCorner.getAddingAngle();
        DominoItem.rotateVector(this.normalVector, addingAngle);
        DominoItem.rotateVector(this.topTopVector, addingAngle);
        DominoItem.rotateVector(this.topLeftVector, addingAngle);
        DominoItem.rotateVector(this.topRightVector, addingAngle);
        DominoItem.rotateVector(this.centerLeftVector, addingAngle);
        DominoItem.rotateVector(this.centerRightVector, addingAngle);
        DominoItem.rotateVector(this.bottomBottomVector, addingAngle);
        DominoItem.rotateVector(this.bottomLeftVector, addingAngle);
        DominoItem.rotateVector(this.bottomRightVector, addingAngle);

        DominoItem.rotateVector(this.topTopDoubleVector, addingAngle);
        DominoItem.rotateVector(this.centerLeftDoubleVector, addingAngle);
        DominoItem.rotateVector(this.centerRightDoubleVector, addingAngle);
        DominoItem.rotateVector(this.bottomBottomDoubleVector, addingAngle);

        DominoItem.rotateVector(this.doubleTopVector, addingAngle);
        DominoItem.rotateVector(this.doubleBottomVector, addingAngle);
        DominoItem.rotateVector(this.doubleLeftVector, addingAngle);
        DominoItem.rotateVector(this.doubleRightVector, addingAngle);
    }

    async setPositionOver(coorsAndCorner: CoorsAndCorner, flyDuration: number, fast: boolean = !WindowFocusController.documentVisible): Promise<void> {
        this.setAlpha(true);
        this.setVisible(true);
        this.moveX = coorsAndCorner.x;
        this.moveY = coorsAndCorner.y;
        if (fast) {
            this.x = this.moveX;
            this.y = this.moveY;
            this.z = 0;
            this.modelRotationX = 0;
            this.modelRotationY = 0;
            this.modelScale = .89;
        } else {
            await WindowFocusController.wrapTween(gsap.to(this, flyDuration, {
                x: this.moveX,
                y: this.moveY,
                z: 0,
                modelRotationX: 0,
                modelRotationY: 0,
                modelScale: .89,
                ease: Sine.easeInOut
            }));
        }
    }

    getGoRotationZ() {
        let goRotationZ: number = DominoItem.getRotationZ(this.double, this.normalVector, this.swapped);
        let ost: number = Math.abs(this.modelRotationZ - goRotationZ) % 180;

        if (this.double && (ost < 5 || ost > 175)) {
            return goRotationZ % 180;
        }
        if (goRotationZ - 180 > this._modelRotationZ) {
            goRotationZ -= 360;
        }
        if (goRotationZ + 180 < this._modelRotationZ) {
            goRotationZ += 360;
        }
        return this.double ? goRotationZ % 180 : goRotationZ;
    }
};