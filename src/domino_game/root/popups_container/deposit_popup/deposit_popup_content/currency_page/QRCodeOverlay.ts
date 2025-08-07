import {DisplayObjectFactory, Pivot, ScreenCovering} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Sprite, Texture} from "pixi.js";
import QRCode from 'qrcode';


export class QRCodeOverlay extends ScreenCovering {
    private background: NineSlicePlane;
    private qrCode: Sprite;

    constructor() {
        super(.4, true);
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("deposit/qr_bg", 20, 20, 20, 20);
    }

    addChildren(): void {
        this.addChild(this.background);
    }

    initChildren(): void {
        this.y = 255;
        this.background.width = this.background.height = 600;
        Pivot.center(this.background);
    }

    show(visible: boolean): void {
        this.visible = visible;
    }

    onOverlayClick() {
        this.show(false);
    }

    async createQRCode(address: string) {
        const qrDataUrl = await QRCode.toDataURL(address);
        const texture = Texture.from(qrDataUrl);
        this.qrCode = new Sprite(texture);
        this.addChild(this.qrCode);
        this.qrCode.scale.set(3);
        this.qrCode.anchor.set(.5, .5);
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.qrCode);
        this.background.destroy();
        this.qrCode.destroy();
        this.background = null;
        this.qrCode = null;
        super.destroy();
    }

}
