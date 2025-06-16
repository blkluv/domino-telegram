import {Matrix, NineSlicePlane} from "pixi.js";
import {DominoGame} from "../../../../../app";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {ScreenCovering} from "@azur-games/pixi-vip-framework";
import {PieceDataEvent} from "../../../../../data/active_data/game_state/PieceData";
import {GameStateData} from "../../../../../data/active_data/GameStateData";
import {PiecePlace} from "../../../../../dynamic_data/PiecePlace";
import {SitPlace} from "../../../../../dynamic_data/SitPlace";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {DominoNumber} from "../domino_logic/DominoNumber";
import {BazarContainer} from "../dominoes_table/BazarContainer";
import {BazarAbsentVals} from "./BazarAbsentVals";
import {BazarItem} from "./BazarItem";


export class BazarWindow extends ScreenCovering {
    private title: LanguageText;
    private bottomBackground: NineSlicePlane;
    private topBackground: NineSlicePlane;
    private bazarAbsentVals: BazarAbsentVals;
    bazarItems: BazarItem[];
    private gameStateData: GameStateData;

    constructor() {
        super(.4);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.interactive = this.interactiveChildren = false;
    }

    createChildren(): void {
        this.title = new LanguageText({key: "Boneyard/title", fontSize: 28, placeholders: []});
        this.bottomBackground = DisplayObjectFactory.createNineSlicePlane("common/bg_violet", 48, 48, 48, 48);
        this.topBackground = DisplayObjectFactory.createNineSlicePlane("friends/page_bg", 30, 30, 30, 30);
        this.bazarItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => new BazarItem(i));
        this.bazarAbsentVals = new BazarAbsentVals();
    }

    addChildren(): void {
        this.addChild(this.bazarAbsentVals);
        this.addChild(this.bottomBackground);
        this.addChild(this.topBackground);
        this.addChild(this.title);
        this.bazarItems.forEach(item => this.addChild(item));
    }

    initChildren(): void {
        this.title.setTextStroke(0x7C52B0, 4);
        this.bottomBackground.width = 920;
        this.bottomBackground.height = 600;
        this.topBackground.width = 890;
        this.topBackground.height = 500;

        Pivot.center(this.title);
        Pivot.center(this.bottomBackground);
        Pivot.center(this.topBackground);
        this.bazarAbsentVals.angle = -90;

        this.title.y = -212;
        this.bottomBackground.y = 32;
        this.topBackground.y = 65;
        let colCount: number = 7;
        this.bazarItems.forEach((item: BazarItem, i: number): void => {
            item.x = -360 + i % colCount * 120;
            item.y = -35 + Math.floor(i / colCount) * 200;
        });

        this.bazarAbsentVals.x = -495;
        this.bazarAbsentVals.y = -107;
    }

    redraw(): void {
        this.setAbsentVals();
        this.enableItems();
        let transform: Matrix = new Matrix();
        transform.tx = 500;
        transform.ty = 500;
        DominoGame.instance.app.renderer.render(this, {renderTexture: BazarContainer.bazarBackTexture, clear: true, transform});
    }

    enableItems(): void {
        this.bazarItems.forEach(item => item.enable(this.gameStateData.turn == SitPlace.BOTTOM));
    }

    setAbsentVals(): void {
        let absentVals: DominoNumber[] = [];
        this.gameStateData.joints.interfaces.forEach(joint => absentVals.includes(joint.value) || absentVals.push(joint.value));
        this.bazarAbsentVals.update(absentVals);
    }

    setGameStateData(socketGameState: GameStateData): void {
        this.gameStateData?.pieces.classes.forEach(pieceData => pieceData.removeListener(PieceDataEvent.UNUSED_IDX_CHANGED, this.onUnusedIdxChanged, this));
        this.gameStateData = socketGameState;
        this.gameStateData.pieces.classes.forEach(pieceData => pieceData.addListener(PieceDataEvent.UNUSED_IDX_CHANGED, this.onUnusedIdxChanged, this));
        this.gameStateData.pieces.classes.forEach(pieceData => this.onUnusedIdxChanged(pieceData.unusedIdx));

    }

    onUnusedIdxChanged(unusedIdx: number): void {
        this.title.applyPlaceholders([this.gameStateData.pieces.interfaces.filter(pieceData => pieceData.place == PiecePlace.UNUSED).length.toString()]);
        unusedIdx >= 0 && this.bazarItems[unusedIdx].setPieceData(this.gameStateData?.pieces.classes.find(pieceData => pieceData.unusedIdx == unusedIdx));
    }

    destroy(): void {
        this.gameStateData?.pieces.classes.forEach(pieceData => pieceData.removeListener(PieceDataEvent.UNUSED_IDX_CHANGED, this.onUnusedIdxChanged, this));
        this.gameStateData = null;

        let bazarItem: BazarItem;
        while (this.bazarItems.length) {
            bazarItem = this.bazarItems.shift();
            this.removeChild(bazarItem);
            bazarItem.destroy();
        }
        this.removeChild(this.title);
        this.removeChild(this.bottomBackground);
        this.removeChild(this.topBackground);
        this.removeChild(this.bazarAbsentVals);

        this.title.destroy();
        this.bottomBackground.destroy();
        this.topBackground.destroy();
        this.bazarAbsentVals.destroy();

        this.title = null;
        this.bottomBackground = null;
        this.topBackground = null;
        this.bazarItems = null;
        this.bazarAbsentVals = null;

        super.destroy();
    }

}
