import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";


export class LobbyHeaderBalance extends Sprite {
    private dollarSign: LanguageText;
    private balanceText: LanguageText;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.dollarSign = new LanguageText({
            key: "$",
            fontSize: 64,
            fontWeight: "500"
        });
        this.balanceText = new LanguageText({
            key: "345",
            fontSize: 96,
            fontWeight: "700",
        });
    }

    addChildren(): void {
        this.addChild(this.dollarSign);
        this.addChild(this.balanceText);
    }

    initChildren(): void {
        this.balanceText.x = 50;
        this.balanceText.y = -30;
    }

    setBalance(coins: number) {
        this.balanceText.text = coins.toString();
    }

    destroy(): void {
        this.removeChild(this.dollarSign);
        this.removeChild(this.balanceText);
        this.dollarSign.destroy();
        this.balanceText.destroy();
        this.dollarSign = null;
        this.balanceText = null;
        super.destroy();
    }

}
