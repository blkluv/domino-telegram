import {Spine} from "pixi-spine";
import {Sprite} from "pixi.js";
import {ButtonBase} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {LobbySpineName} from "../../../../factories/spine_factory/LobbySpineName";
import {SpineFactory} from "../../../../factories/SpineFactory";
import {GameEvents} from "../../../../GameEvents";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {FormattedTime} from "@azur-games/pixi-vip-framework";
import {StringUtils} from "@azur-games/pixi-vip-framework";


;

export class WheelButton extends ButtonBase {
    private activeWheel: Spine;
    private inactiveWheel: Sprite;
    private timerText: LanguageText;
    private intervalId: number;
    private startTimerBindThis: (e: MessageEvent) => void;

    constructor(callback: Function) {
        super(callback, undefined, true);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.startTimer();

        this.startTimerBindThis = this.startTimer.bind(this);
        addEventListener(GameEvents.WHEEL_UPDATED, this.startTimerBindThis);
    }

    createChildren(): void {
        this.timerText = new LanguageText({
            key: "Lobby/LUCKY_SPIN",
            fontSize: 34,
            fill: 0xffffff,
            fontWeight: "700",
            autoFitWidth: 260,
            centerAfterLanguageChanged: true
        });
        this.activeWheel = SpineFactory.createLobbySpine(LobbySpineName.WHEEL_START);
        this.inactiveWheel = DisplayObjectFactory.createSprite("lobby/icon_luckyspin_disactive");
    }

    addChildren(): void {
        this.addChild(this.activeWheel);
        this.addChild(this.inactiveWheel);
        this.addChild(this.timerText);
    }

    initChildren(): void {
        this.activeWheel.scale.set(.185);
        this.timerText.setTextStroke(0x145380, 4);
        Pivot.center(this.timerText);
        this.activeWheel.y = this.inactiveWheel.y = -62;
        this.activeWheel.x = this.inactiveWheel.x = 2.5;
    }

    animateWheel(value: boolean): void {
        this.activeWheel.visible = value;
        this.inactiveWheel.visible = !value;
    }

    private startTimer() {
        if (DynamicData.wheel.delay <= 0) {
            this.intervalId && window.clearInterval(this.intervalId);
            this.timerText.changeText("Lobby/LuckySpin");
            // this.spine.state.setAnimation(0, LobbySpineName.WHEEL_START, true);
            this.animateWheel(true);
            return;
        }
        // this.spine.state.setAnimation(0, LobbySpineName.WHEEL_IDLE, true);
        this.animateWheel(false);
        this.update();
        this.intervalId = window.setInterval(() => this.update(), 1000);
    }

    update(): void {
        let time: number = Math.max(0, (DynamicData.wheelResponseTime + DynamicData.wheel.delay) - Date.now());
        if (time) {
            let formattedTime: FormattedTime = StringUtils.formatTime(time);
            this.timerText.changeText(formattedTime.hours + ":" + formattedTime.minutes + ":" + formattedTime.seconds);
        } else {
            window.clearInterval(this.intervalId);
            this.timerText.changeText("Lobby/LuckySpin");
            // this.spine.state.setAnimation(0, LobbySpineName.WHEEL_START, true);
            this.animateWheel(true);
        }
    }

    destroy(): void {
        this.activeWheel.state.timeScale = 0;
        window.clearInterval(this.intervalId);

        removeEventListener(GameEvents.WHEEL_UPDATED, this.startTimerBindThis);
        this.startTimerBindThis = null;

        this.removeChild(this.activeWheel);
        this.removeChild(this.inactiveWheel);
        this.removeChild(this.timerText);
        this.activeWheel.destroy();
        this.inactiveWheel.destroy();
        this.timerText.destroy();
        this.activeWheel = null;
        this.inactiveWheel = null;
        this.timerText = null;

        super.destroy();
    }
}
