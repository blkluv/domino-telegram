import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../DynamicData";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Bet} from "./cloth_inscription/Bet";


export class ClothInscription extends Sprite {
    private dominoText: LanguageText;
    private modeText: LanguageText;
    private betContainer: Bet;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.dominoText = new LanguageText({
            key: "DOMINO",
            fill: 0x174847,
            fontSize: 146
        });
        this.modeText = new LanguageText({
            key: "Back/GameMode/" + DynamicData.socketGameRequest.mode.toUpperCase(),
            fill: 0x174847,
            fontSize: 88
        });
        this.betContainer = new Bet();
    }

    addChildren(): void {
        this.addChild(this.dominoText);
        this.addChild(this.modeText);
        this.addChild(this.betContainer);
    }

    initChildren(): void {
        this.dominoText.style.letterSpacing = 20;

        this.dominoText.alpha = .141;
        this.modeText.alpha = .141;

        this.dominoText.style.stroke = 0xffffff5f;
        this.dominoText.style.strokeThickness = 2;
        this.modeText.style.stroke = 0xffffff5f;
        this.modeText.style.strokeThickness = 2;

        this.dominoText.y = -120;
        this.betContainer.y = 100;

        Pivot.center(this.dominoText);
        Pivot.center(this.modeText);
        this.scale.set(.7);
    }

    destroy(): void {
        this.removeChild(this.dominoText);
        this.removeChild(this.modeText);
        this.removeChild(this.betContainer);

        this.dominoText.destroy();
        this.modeText.destroy();
        this.betContainer.destroy();

        this.dominoText = undefined;
        this.modeText = undefined;
        this.betContainer = undefined;

        super.destroy();
    }
}
