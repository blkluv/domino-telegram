import {Sprite, NineSlicePlane} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {DepositStepDescription} from "./DepositStepDescription";


export class DepositSteps extends Sprite {
    private frame: NineSlicePlane;
    private steps: DepositStepDescription[];

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.frame = DisplayObjectFactory.createNineSlicePlane("deposit/deposit_stages_frame", 30, 30, 30, 30);
        this.steps = [
            new DepositStepDescription("1", "Choose currency"),
            new DepositStepDescription("2", "Send assets to provided deposit address"),
            new DepositStepDescription("3", "Wait the balance update")
        ];

    }

    addChildren() {
        this.addChild(this.frame);
        this.steps.forEach(step => this.addChild(step));
    }

    initChildren() {
        this.frame.width = 960;
        this.frame.height = 297;

        Pivot.center(this.frame);
        this.steps.forEach((step, i) => {
            step.x = -400;
            step.y = 70 * i - 68;
        });
    }

    destroy() {
        while (this.steps.length) {
            const step = this.steps.shift();
            step.destroy();
            this.removeChild(step);
        }

        this.removeChild(this.frame);
        this.frame.destroy();
        this.frame = null;
        this.steps = null;
        super.destroy();
    }
}