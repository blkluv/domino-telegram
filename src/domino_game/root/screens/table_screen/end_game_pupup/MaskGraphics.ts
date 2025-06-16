import {LINE_CAP, LINE_JOIN} from "@pixi/graphics";
import {Graphics} from "pixi.js";
import {DominoGame} from "../../../../../app";


export class MaskGraphics extends Graphics {
    private lineWidth: number = 400;
    private stepsCount: number;
    private step: number = 0;
    private topCoorX: number = 0;
    private topCoorY: number = 0;
    private leftCoorX: number = 0;
    private leftCoorY: number = 0;
    private coorX: number = 0;
    private coorY: number = 0;
    private prevCoorX: number;
    private prevCoorY: number;
    private left: boolean = false;
    private longs: number[] = [];
    private tos: {x: number, y: number}[] = [];
    private currentLong: number;
    private totalLong: number = 0;
    private lastDrawnLineX: number;
    private lastDrawnLineY: number;
    private lastIndex: number;

    constructor() {
        super();

        this.lineStyle({width: this.lineWidth / 2, cap: LINE_CAP.ROUND, join: LINE_JOIN.ROUND});
        this.stepsCount = Math.floor((DominoGame.instance.screenW + this.lineWidth * 2 + DominoGame.instance.screenH) / this.lineWidth);
        this.resize();
    }

    private _progress: number = 0;

    get progress(): number {
        return this._progress;
    }

    set progress(value: number) {
        this.clear();
        this.lineStyle({width: this.lineWidth, cap: LINE_CAP.ROUND, join: LINE_JOIN.ROUND});
        this._progress = value;
        let halfLong: number = this.totalLong * value;

        let tosLong: number = 0;
        let braked: boolean = false;
        let leftLong: number;
        let lastLineX: number;
        let lastLineY: number;
        let longLastPart: number;
        this.tos.forEach((to: {x: number, y: number}, index: number) => {
            if (braked) {
                return;
            }
            leftLong = halfLong - tosLong;
            tosLong += this.longs[index];

            if (tosLong > halfLong) {
                longLastPart = leftLong / this.longs[index];
                braked = true;
                this.lastDrawnLineX = lastLineX + (to.x - lastLineX) * longLastPart;
                this.lastDrawnLineY = lastLineY + (to.y - lastLineY) * longLastPart;
                this.lastIndex = index - 1;
                this.lineTo(this.lastDrawnLineX, this.lastDrawnLineY);
                return;
            }
            lastLineX = to.x;
            lastLineY = to.y;
            this.lineTo(to.x, to.y);
        });
    }

    resize(): void {
        this.step = 0;
        this.coorX = 0;
        this.coorY = 0;
        this.leftCoorX = 0;
        this.topCoorX = 0;
        this.leftCoorY = 0;
        this.topCoorY = 0;
        this.totalLong = 0;
        this.longs.length = 0;
        while (this.step++ < this.stepsCount) {
            this.cycle();
            if (this.topCoorX < DominoGame.instance.screenW + this.lineWidth) {
                this.topCoorX += this.lineWidth;
            } else {
                this.topCoorY += this.lineWidth;
            }
            this.cycle();
            if (this.leftCoorY < DominoGame.instance.screenH + this.lineWidth) {
                this.leftCoorY += this.lineWidth;
            } else {
                this.leftCoorX += this.lineWidth;
            }
            this.cycle();

            this.left = !this.left;
        }
    }

    private cycle() {
        this.prevCoorX = this.coorX;
        this.prevCoorY = this.coorY;
        this.coorX = this.left ? this.leftCoorX : this.topCoorX;
        this.coorY = this.left ? this.leftCoorY : this.topCoorY;
        this.tos.push({x: this.coorX, y: this.coorY});
        this.currentLong = Math.sqrt(Math.pow(this.coorX - this.prevCoorX, 2) + Math.pow(this.coorY - this.prevCoorY, 2));
        this.totalLong += this.currentLong;
        this.longs.push(this.currentLong);
    }
}