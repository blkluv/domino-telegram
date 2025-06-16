import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {StringUtils} from "@azur-games/pixi-vip-framework";


;

export class WheelTimer extends Sprite {
    private canPlayText: LanguageText;
    private timeText: LanguageText;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
    }

    createChildren(): void {
        this.canPlayText = new LanguageText({key: "WheelWindow/CanBePlayerIn", fontSize: 29, fontWeight: "400"});
        this.timeText = new LanguageText({key: "", fontSize: 29});
    }

    addChildren(): void {
        this.addChild(this.canPlayText);
        this.addChild(this.timeText).y = 1;
    }

    update(date: number): void {
        this.timeText.changeText(StringUtils.createLocaleTimeString(date), false);
        this.timeText.x = this.canPlayText.width + 10;
        let width: number = this.timeText.x + this.timeText.width;
        this.x = -width / 2;
    }

    destroy(): void {
        this.removeChild(this.canPlayText);
        this.removeChild(this.timeText);

        this.canPlayText.destroy();
        this.timeText.destroy();

        this.canPlayText = null;
        this.timeText = null;

        super.destroy();
    }
}
