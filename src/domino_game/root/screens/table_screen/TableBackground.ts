import {DisplayObjectFactory, Pivot, StageResizeListening} from "@azur-games/pixi-vip-framework";
import {Sprite, TilingSprite} from "pixi.js";
import {DominoGame} from "../../../../app";
import {GameEvents} from "../../../../GameEvents";
import {Hand} from "./table_background/Hand";
import {TableBackgroundType} from "./TableBackroundType";


export class TableBackground extends StageResizeListening {
    private tilingBack: TilingSprite;
    private vingette: Sprite;
    private cloth: Sprite;
    private propsTopRight: Sprite;
    private propsBottomLeft: Sprite;
    private propsBottomRight: Sprite;
    private hand: Hand;
    private onDragOverHandBindThis: (e: MessageEvent) => void;
    private onDragOverTableBindThis: (e: MessageEvent) => void;

    constructor(private tableBackgroundType: TableBackgroundType) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onGameScaleChanged();

        this.onDragOverTableBindThis = this.onDragOverTable.bind(this);
        addEventListener(GameEvents.DRAG_OVER_TABLE, this.onDragOverTableBindThis);

        this.onDragOverHandBindThis = this.onDragOverHand.bind(this);
        addEventListener(GameEvents.DRAG_OVER_HAND, this.onDragOverHandBindThis);
    }

    destroy() {
        this.tableBackgroundType = undefined;

        removeEventListener(GameEvents.DRAG_OVER_TABLE, this.onDragOverTableBindThis);
        this.onDragOverTableBindThis = undefined;

        removeEventListener(GameEvents.DRAG_OVER_HAND, this.onDragOverHandBindThis);
        this.onDragOverHandBindThis = undefined;

        this.removeChild(this.tilingBack);
        this.removeChild(this.vingette);
        this.removeChild(this.cloth);
        this.removeChild(this.propsTopRight);
        this.removeChild(this.propsBottomLeft);
        this.removeChild(this.propsBottomRight);
        this.removeChild(this.hand);

        this.tilingBack.destroy();
        this.vingette.destroy();
        this.cloth.destroy();
        this.propsTopRight.destroy();
        this.propsBottomLeft.destroy();
        this.propsBottomRight.destroy();
        this.hand.destroy();

        this.tilingBack = undefined;
        this.vingette = undefined;
        this.cloth = undefined;
        this.propsTopRight = undefined;
        this.propsBottomLeft = undefined;
        this.propsBottomRight = undefined;
        this.hand = undefined;

        super.destroy();
    }

    onGameScaleChanged(e?: MessageEvent): void {
        this.tilingBack.width = DominoGame.instance.screenW;
        this.tilingBack.height = DominoGame.instance.screenH;
        this.tilingBack.tilePosition.x = DominoGame.instance.screenW / 2;
        this.tilingBack.tilePosition.y = DominoGame.instance.screenH / 2;
        /*this.tilingBack.tileScale.x = 2.5;
        this.tilingBack.tileScale.y = 2.5;*/
        Pivot.center(this.tilingBack);
        this.vingette.width = DominoGame.instance.screenW + 10;
        this.vingette.height = DominoGame.instance.screenH + 10;
        Pivot.center(this.vingette);
        this.tilingBack.clampMargin = 2 / DominoGame.instance.scale;

        let propsMinX: number = Math.min(DominoGame.instance.screenW / 2, 1600);
        let propsMinY: number = Math.min(DominoGame.instance.screenH / 2, 1400);

        this.propsTopRight.x = propsMinX;
        this.propsTopRight.y = -propsMinY;

        this.propsBottomLeft.x = -propsMinX;
        this.propsBottomLeft.y = propsMinY;

        this.propsBottomRight.x = propsMinX;
        this.propsBottomRight.y = propsMinY;

        this.hand.y = DominoGame.instance.screenH / 2 - 175;
    }

    private onDragOverTable(): void {
        this.hand.up(false);
    }

    private createChildren() {
        this.tilingBack = DisplayObjectFactory.createTiling("table/" + this.tableBackgroundType + "/bg_tile");
        this.vingette = DisplayObjectFactory.createSprite("table/" + this.tableBackgroundType + "/vingette");
        this.cloth = DisplayObjectFactory.createSprite("table/" + this.tableBackgroundType + "/cloth");
        this.propsTopRight = DisplayObjectFactory.createSprite("table/" + this.tableBackgroundType + "/props/top_right");
        this.propsBottomLeft = DisplayObjectFactory.createSprite("table/" + this.tableBackgroundType + "/props/bottom_left");
        this.propsBottomRight = DisplayObjectFactory.createSprite("table/" + this.tableBackgroundType + "/props/bottom_right");
        this.hand = new Hand();
    }

    private addChildren() {
        this.addChild(this.tilingBack);
        this.addChild(this.vingette);
        this.addChild(this.cloth);
        this.addChild(this.propsTopRight);
        this.addChild(this.propsBottomLeft);
        this.addChild(this.propsBottomRight);
        this.addChild(this.hand);
    }

    private initChildren() {
        Pivot.center(this.cloth);
    }

    private onDragOverHand(): void {
        this.hand.up();
    }
}