import {Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";


export class SignInButton extends Button {
    constructor(callback: Function, bgTextureName: string, iconTextureName: string, iconPosition: Point = new Point(-90, 0)) {
        super({
            callback,
            bgTextureName,
            bgCornersSize: 52,
            bgSizes: new Point(276, 90),
            iconTextureName,
            iconPosition,
            textKey: "Settings/SignIn",
            fontSize: 42,
            textPosition: new Point(20, -3),
            autoFitWidth: 140
        });
        this.languageText.setTextShadow();
    }
}