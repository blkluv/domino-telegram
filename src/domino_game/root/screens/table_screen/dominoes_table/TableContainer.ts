import {DominoCalculator} from "@azur-games/pixi-domino-core";
import {Sine, TweenMax} from "gsap/gsap-core";
import {IDestroyOptions} from "pixi.js";
import {Sprite3D} from "pixi3d";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../DynamicData";
import {Settings3D} from "../../../../../utils/Settings3D";
import {DominoesTable} from "../DominoesTable";


export class TableContainer extends Sprite3D {
    private moveTween: TweenMax;
    zoom: number = 1;//для портрета ставить 3-4

    constructor() {
        super();
        this.reset();
    }

    get scaling(): number {
        return this.scale.x / this.zoom;
    }

    set scaling(value: number) {
        this.scale.set(value * this.zoom);
    }

    async move(minX: number, maxX: number, minY: number, maxY: number, fast: boolean = !WindowFocusController.documentVisible): Promise<void> {
        let width: number = Math.abs(maxX - minX);
        let height: number = Math.abs(maxY - minY);
        let maxWidth: number = DominoCalculator.getMaxWidthAndHeight(DynamicData.socketGameRequest.mode).x
        let tableGoScale: number = Math.min(maxWidth / width, 1);
        let tableGoX: number = (minX + width / 2) * tableGoScale * this.zoom;
        let tableGoY: number = (minY + height / 2) * tableGoScale * this.zoom * Settings3D.cosCorner;
        if (fast) {
            this.x = tableGoX;
            this.y = tableGoY;
            this.scaling = tableGoScale;
            return;
        }
        this.moveTween?.kill();
        await WindowFocusController.wrapTween(this.moveTween = TweenMax.to(this, .3, {x: tableGoX, y: tableGoY, scaling: tableGoScale, ease: Sine.easeInOut}));
    }

    destroy(options?: boolean | IDestroyOptions) {
        super.destroy(options);

        this.moveTween?.kill();
        this.moveTween = null;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.scaling = 1;
    }
}