import {Power1, TweenMax} from "gsap";
import {InteractionEvent, NineSlicePlane, Point, Sprite} from "pixi.js";
import {Clamp, DisplayObjectFactory, DraggableObject, FrameworkEvents, IPoint, Pivot} from "../../../../../../pixi-vip-framework";
import {DominoGame} from "../../../../app";
import {RoomsHeader} from "./lobby_rooms/RoomsHeader";
import {RoomsList} from "./lobby_rooms/RoomsList";


export class LobbyRooms extends DraggableObject {
    private top: number = -DominoGame.instance.screenH / 2 + 720;
    private bottom: number = -DominoGame.instance.screenH / 2 + 60;
    private speed: number;
    private pointerStart: number;
    private minListHeight: number = 1131;
    private maxListHeight: number = 1700;
    private listHeight: number = this.minListHeight;
    private header: RoomsHeader;
    private roomsList: RoomsList;
    private bgGradient: NineSlicePlane;
    private background: NineSlicePlane;
    private magnetizeTween: TweenMax;
    private listHeightTween: TweenMax;
    private pointerDown: boolean;
    private onMouseWheelBindThis: (e: Event) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.onMouseWheelBindThis = this.onWheel.bind(this);
        addEventListener(FrameworkEvents.MOUSE_WHEEL, this.onMouseWheelBindThis);
    }

    magnetizeToCoor(coor: number) {
        this.magnetizeTween?.kill();
        this.magnetizeTween = TweenMax.to(this, .3, {
            y: coor,
            ease: Power1.easeOut,
        });
    }

    changeListHeight(progress: number): void {
        this.listHeightTween?.kill();
        this.listHeightTween = TweenMax.to(this, .3, {
            listHeight: Clamp.between(this.minListHeight, this.minListHeight + ((this.maxListHeight - this.minListHeight) * progress), this.maxListHeight),
            ease: Power1.easeOut,
            onUpdate: () => this.roomsList.block(this.listHeight < this.maxListHeight)
        });
    }

    onPointerDown(e: InteractionEvent): void {
        this.pointerDown = true;
        this.speed = 0;
        this.pointerStart = this.y;
        super.onPointerDown(e);
    }

    tryMove(): void {
        let y: number = this.movePosition.y - this.pointerStartOffset.y;
        let newPos: IPoint = this.clampPos(0, y);
        let newY: number = newPos.y;
        this.speed = newY - this.y;
        this.scroll(newY / this.bottom);
        if (Math.abs(this.y - this.pointerStart) > 10) {
            this.dragged = true;
        }
    }

    clampPos(_x: number, y: number): IPoint {
        let clampedY = Clamp.between(this.bottom, y, this.top);
        return {x: 0, y: clampedY};
    }

    onWheel(e: MessageEvent): void {
        let data: {wheelDelta: IPoint} = e.data;
        let progress: number = data.wheelDelta.y / Math.abs(data.wheelDelta.y) * 100;
        let clampedPosition: number = Clamp.between(this.bottom, this.y - progress, this.top);
        this.scroll(clampedPosition / this.bottom);
    }

    onPointerUp(e: InteractionEvent) {
        let dragged: boolean = this.dragged;
        super.onPointerUp(e);
        if (!dragged && !this.pointerDown) {
            return;
        }
        this.dragged = false;
        this.pointerDown = false;
        this.scroll(Clamp.between(this.bottom, this.y + this.speed * 10, this.top) / this.bottom);
    }

    scroll(scrollPosition: number): void {
        this.changeListHeight(scrollPosition);
        if (this.roomsList.listPosition.y < 0) {
            this.roomsList.block(false);
            return;
        }
        let position: number = scrollPosition * this.bottom;
        this.magnetizeToCoor(position);
    }

    createChildren(): void {
        this.header = new RoomsHeader();
        this.roomsList = new RoomsList();
        this.bgGradient = DisplayObjectFactory.createNineSlicePlane("lobby/rooms_header_gradient", 2, 2, 2, 2);
        this.background = DisplayObjectFactory.createNineSlicePlane("lobby/lobby_bg", 1, 1, 1, 1);
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.bgGradient);
        this.addChild(this.header);
        this.addChild(this.roomsList);
    }

    resize(): void {
        this.bgGradient.width = DominoGame.instance.screenW;
        this.bgGradient.height = 300;
        this.background.width = DominoGame.instance.screenW;
        this.background.height = this.minListHeight + 90;

        Pivot.center(this.bgGradient);
        Pivot.center(this.background);

        this.y = -DominoGame.instance.screenH / 2 + 720;
        this.bgGradient.y = -this.bgGradient.height / 2;
        this.background.y = this.background.height / 2 - 2;
        this.roomsList.y = 70;
    }

    destroy(): void {
        this.magnetizeTween?.kill();
        this.listHeightTween?.kill();

        this.removeChild(this.header);
        this.removeChild(this.roomsList);
        this.removeChild(this.bgGradient);
        this.removeChild(this.background);

        this.header.destroy();
        this.roomsList.destroy();
        this.bgGradient.destroy();
        this.background.destroy();

        this.header = null;
        this.roomsList = null;
        this.bgGradient = null;
        this.background = null;
        this.magnetizeTween = null;
        this.listHeightTween = null;

        super.destroy();
    }
} 