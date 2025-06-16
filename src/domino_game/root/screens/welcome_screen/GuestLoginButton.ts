import {Button, GraphicsFactory, Pivot} from "@azur-games/pixi-vip-framework";
import {Graphics} from "pixi.js";


export class GuestLoginButton extends Button {
    private underline: Graphics;

    constructor(callback: Function) {
        super({
            callback,
            textKey: "LoginWindow/guest",
            fontWeight: "700",
            fontColor: 0xFFC401,
            fontSize: 36
        });
        this.underline = GraphicsFactory.createRect(0, 22, this.languageText.width, 2, 0xFFC401);
        this.addChild(this.underline);
        Pivot.center(this.underline);
    }

    destroy(): void {
        this.removeChild(this.underline);
        this.underline.destroy();
        this.underline = null;
        super.destroy();
    }
}
