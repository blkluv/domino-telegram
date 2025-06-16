import {Sprite} from "pixi.js";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {Timeout} from "@azur-games/pixi-vip-framework";
import {LabelColor, StateLabel} from "./state_labels/StateLabel";


export class StateLabels extends Sprite {
    constructor() {
        super();
    }

    async createLabel(color: LabelColor, text: string, high: boolean = false): Promise<void> {
        if (!WindowFocusController.documentVisible) {
            return;
        }
        let label = new StateLabel(color, text);
        this.addChild(label).y = high ? -270 : 0;
        await label.show();
        await Timeout.seconds(.5);
        await label.hide();
        this.removeChild(label);
        label.destroy();
    }

    destroy() {
        super.destroy();
    }
}