import {LanguageText, DisplayObjectFactory, Pivot} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Sprite} from "pixi.js";


export class CurrencyItemDetail extends Sprite {
    private background: NineSlicePlane;
    private descriptionText: LanguageText;
    private valueText: LanguageText;

    constructor(private descriptionTextValue: string, private valueTextValue: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("deposit/green_bg", 22, 23, 22, 22);
        this.descriptionText = new LanguageText({key: this.descriptionTextValue, fontSize: 22, fontWeight: "400", fill: 0x7BA2FF});
        this.valueText = new LanguageText({key: this.valueTextValue, fontSize: 28});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.descriptionText);
        this.addChild(this.valueText);
    }

    initChildren(): void {
        this.background.width = 118;
        this.background.height = 46;

        Pivot.center(this.background);
        Pivot.center(this.descriptionText);
        Pivot.center(this.valueText);

        this.descriptionText.y = -29;
        this.background.y = 16;
        this.valueText.y = 15;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.descriptionText);
        this.removeChild(this.valueText);

        this.background.destroy();
        this.descriptionText.destroy();
        this.valueText.destroy();

        this.background = null;
        this.descriptionText = null;
        this.valueText = null;

        super.destroy();
    }
}
