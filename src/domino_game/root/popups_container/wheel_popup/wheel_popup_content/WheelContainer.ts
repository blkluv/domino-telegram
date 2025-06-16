import {Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../DynamicData";
import {GameEvents} from "../../../../../GameEvents";
import {Wheel} from "./wheel_container/Wheel";
import {WheelContainerBackground} from "./wheel_container/WheelContainerBackground";
import {WheelInfoBlock} from "./wheel_container/WheelInfoBlock";


export class WheelContainer extends Sprite {
    background: WheelContainerBackground;
    closeButton: Button;
    wheel: Wheel;
    private infoBlock: WheelInfoBlock;
    private startTimerBindThis: (e: MessageEvent) => void;
    private intervalId: number;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.startTimer();

        this.startTimerBindThis = this.startTimer.bind(this);
        addEventListener(GameEvents.WHEEL_UPDATED, this.startTimerBindThis);
    }

    createChildren(): void {
        this.background = new WheelContainerBackground();
        this.closeButton = new Button({callback: this.onClose.bind(this), bgTextureName: "common/button_close"});
        this.wheel = new Wheel();
        this.infoBlock = new WheelInfoBlock();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.closeButton);
        this.addChild(this.wheel);
        this.addChild(this.infoBlock);
    }

    initChildren(): void {
        this.wheel.x = -320;
        this.wheel.y = 40;
        this.infoBlock.x = 550;
    }

    onClose(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_WHEEL_POPUP));
    }

    private startTimer(): void {
        if (DynamicData.wheel.delay <= 0) {
            this.activateWheel(true);
            return;
        }

        this.activateWheel(false);
        this.update();
        this.intervalId = window.setInterval(() => this.update(), 1000);
    }

    update(): void {
        let time: number = Math.max(0, (DynamicData.wheelResponseTime + DynamicData.wheel.delay) - Date.now());
        time ? this.infoBlock.timer.update(time) : this.activateWheel(true);
    }

    activateWheel(value: boolean): void {
        this.infoBlock.activate(value);
        this.wheel.activate(value);
        (value && this.intervalId) && window.clearInterval(this.intervalId);
    }

    destroy(): void {
        window.clearInterval(this.intervalId);
        removeEventListener(GameEvents.WHEEL_UPDATED, this.startTimerBindThis);
        this.startTimerBindThis = null;

        this.removeChild(this.background);
        this.removeChild(this.closeButton);
        this.removeChild(this.wheel);
        this.removeChild(this.infoBlock);

        this.background.destroy();
        this.closeButton.destroy();
        this.wheel.destroy();
        this.infoBlock.destroy();

        this.background = null;
        this.closeButton = null;
        this.wheel = null;
        this.infoBlock = null;

        super.destroy();
    }
}
