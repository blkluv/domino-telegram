import {NineSlicePlane, Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextCaseFormat} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class ProfileStatisticsTabPlaceholder extends Sprite {
    private background: NineSlicePlane;
    private statisticsText: LanguageText;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("profile/tab_bg", 52, 52, 52, 52);
        this.statisticsText = new LanguageText({key: "Profile/Statistics", fontSize: 34, fill: 0x7B7872, textFormat: TextCaseFormat.UPPERCASE});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.statisticsText);
    }

    initChildren(): void {
        this.background.width = 883;
        this.background.height = 110;
        Pivot.center(this.background);
        Pivot.center(this.statisticsText);
        this.statisticsText.y = 2;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.statisticsText);

        this.background.destroy();
        this.statisticsText.destroy();

        this.background = null;
        this.statisticsText = null;

        super.destroy();
    }
}
