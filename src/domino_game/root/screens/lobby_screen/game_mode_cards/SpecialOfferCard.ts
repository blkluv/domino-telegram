import {Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class SpecialOfferCard extends Button {
    private specialOfferText: LanguageText;

    constructor(callback: Function) {
        super({
            callback, bgTextureName: "lobby/cards_purple",
            bgCornersSize: [51, 51, 51, 55],
            bgSizes: new Point(370, 600),
            iconTextureName: "lobby/bg_special_offer",
        });
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.specialOfferText = new LanguageText({key: "Lobby/GameMode/SPECIAL_OFFER", fontSize: 50, fill: 0xfff4db, autoFitWidth: 270, centerAfterLanguageChanged: true});
    }

    addChildren(): void {
        this.addChild(this.specialOfferText);
    }

    initChildren(): void {
        this.specialOfferText.setTextStroke(0x6E62CB, 4);
        Pivot.center(this.specialOfferText);
    }

    destroy(): void {
        this.removeChild(this.specialOfferText);
        this.specialOfferText.destroy();
        this.specialOfferText = null;

        super.destroy();
    }
}
