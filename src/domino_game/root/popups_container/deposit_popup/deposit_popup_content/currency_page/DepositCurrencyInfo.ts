import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Sprite} from "pixi.js";


export class DepositCurrencyInfo extends Sprite {
    private labelText: LanguageText;
    private valueText: LanguageText;

    constructor(private label: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.labelText = new LanguageText({key: this.label, fontSize: 32, fill: 0x7BA2FF, fontWeight: "400"});
        this.valueText = new LanguageText({key: "", fontSize: 30, fill: 0x7BA2FF, fontWeight: "400"});
    }

    addChildren(): void {
        this.addChild(this.labelText);
        this.addChild(this.valueText);
    }

    initChildren(): void {
        this.labelText.x = -460;
        this.valueText.x = 460;
        this.valueText.y = 20;
        this.valueText.anchor.set(1, 0.5);
    }

    applyData(value: string) {
        this.valueText.changeText(value, false);
    }

    destroy(): void {
        this.removeChild(this.labelText);
        this.removeChild(this.valueText);

        this.labelText.destroy();
        this.valueText.destroy();

        this.labelText = null;
        this.valueText = null;
        super.destroy();
    }
}
