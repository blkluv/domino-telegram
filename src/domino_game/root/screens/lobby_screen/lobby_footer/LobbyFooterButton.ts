import {Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";


export class LobbyFooterButton extends Button {
    constructor(callback: Function, iconTextureName: string, textKey: string) {
        super({
            callback,
            bgTextureName: "lobby/circle_plate_menu",
            iconTextureName,
            iconPosition: new Point(0, -4),
            textKey,
            fontSize: 30,
            fontColor: 0xffffff,
            textPosition: new Point(0, 55),
            autoFitWidth: 200
        });
        this.languageText.setTextStroke(0x145380, 3);
    }
}