import {Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";


export class ShareSocialButton extends Button {
    constructor(callback: Function, textKey: string, iconTextureName: string) {
        super({
            callback,
            textKey,
            iconTextureName,
            fontSize: 18,
            textPosition: new Point(0, 70)
        });

        this.languageText.setTextStroke(0x7A6140, 6);
    }

}