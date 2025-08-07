import {Sprite, Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";


export class AddressBlock extends Sprite {
    private copyButton: Button;
    private address: string;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
    }

    createChildren() {
        this.copyButton = new Button({
            callback: this.copyToClipboard.bind(this),
            bgTextureName: "common/green_button",
            bgSizes: new Point(960, 94),
            bgCornersSize: 34,
            textKey: "Copy address",
            fontSize: 40,
            fontWeight: "400",
            textPosition: new Point(40, -6),
            iconTextureName: "deposit/copy_icon",
            iconPosition: new Point(-140, -4)
        });
    }

    addChildren() {
        this.addChild(this.copyButton);
    }

    applyData(address: string) {
        this.address = address;
    }

    private async copyToClipboard() {
        await navigator.clipboard.writeText(this.address);
        this.copyButton.languageText.changeText("Copied!");
        setTimeout(() => {
            this.copyButton.languageText.changeText("Copy address");
        }, 1500);
    }

    destroy() {
        this.removeChild(this.copyButton);
        this.copyButton.destroy();
        this.copyButton = null;

        super.destroy();
    }
}