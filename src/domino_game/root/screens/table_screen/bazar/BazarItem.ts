import {NineSlicePlane, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {PieceData, PieceDataEvent} from "../../../../../data/active_data/game_state/PieceData";
import {ActiveData} from "../../../../../data/ActiveData";
import {IPossibleMoveData} from "../../../../../dynamic_data/IPossibleMoveData";
import {MoveAction} from "../../../../../dynamic_data/MoveAction";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {SocketService} from "../../../../../services/SocketService";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class BazarItem extends Sprite {
    private emptyPlaceholder: NineSlicePlane;
    private piece: Button;
    private pieceData: PieceData;

    constructor(public index: number) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.emptyPlaceholder = DisplayObjectFactory.createNineSlicePlane("table/bazar/empty_place", 34, 34, 34, 34);
        this.piece = new Button({bgTextureName: "table/bazar/piece", callback: this.onClick.bind(this)});
    }

    addChildren(): void {
        this.addChild(this.emptyPlaceholder);
        //this.addChild(this.piece).visible = false;
    }

    initChildren(): void {
        this.emptyPlaceholder.width = 115;
        this.emptyPlaceholder.height = 200;

        Pivot.center(this.emptyPlaceholder);
        Pivot.center(this.piece);
    }

    enable(value: boolean): void {
        this.piece.enabled = value;
        this.piece.changeBackgroundImage("table/bazar/piece" + (value ? "" : "_disabled"));
    }

    onClick(): void {
        let possibleMoves: IPossibleMoveData[] = ActiveData.gameStateData.possibleMoves.interfaces.filter(move => move.action == MoveAction.TAKE);
        let move: IPossibleMoveData = possibleMoves.find(move => move.unusedIdx == this.index);
        SocketService.move(move);
    }

    setPieceData(pieceData: PieceData): void {
        this.pieceData?.removeListener(PieceDataEvent.UNUSED_IDX_CHANGED, this.onUnusedIdxChanged, this);
        this.pieceData = pieceData;
        this.pieceData?.addListener(PieceDataEvent.UNUSED_IDX_CHANGED, this.onUnusedIdxChanged, this);
        this.onUnusedIdxChanged(pieceData.unusedIdx);
    }

    onUnusedIdxChanged(unusedIdx: number): void {
        let taken: boolean = unusedIdx == null || unusedIdx == -1;
        this.piece.visible = !taken;
    }

    destroy(): void {
        this.pieceData?.removeListener(PieceDataEvent.UNUSED_IDX_CHANGED, this.onUnusedIdxChanged, this);
        this.pieceData = null;

        this.removeChild(this.emptyPlaceholder);
        this.removeChild(this.piece);
        this.emptyPlaceholder.destroy();
        this.piece.destroy();
        this.emptyPlaceholder = null;
        this.piece = null;
        super.destroy();
    }
}
