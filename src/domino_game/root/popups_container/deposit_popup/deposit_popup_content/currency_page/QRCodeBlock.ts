import {Sprite, NineSlicePlane, Graphics} from "pixi.js";
import {DisplayObjectFactory, LanguageText, Button, Pivot} from "@azur-games/pixi-vip-framework";
import {QRCodeOverlay} from "./QRCodeOverlay";


export class QRCodeBlock extends Sprite {
    private background: NineSlicePlane;
    private qrCodeContainer: Sprite;
    private qrCodePlaceholder: Graphics;
    private showQRButton: Button;
    private showQRButtonGradient: NineSlicePlane;
    private showQRButtonText: LanguageText;
    private qrIcon: Sprite;
    private addressText: LanguageText;
    private qrOverlay: QRCodeOverlay;
    private address: string;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("deposit/qr_bg", 20, 20, 20, 20);

        this.qrCodeContainer = new Sprite();
        this.qrCodePlaceholder = new Graphics();

        this.showQRButton = new Button({callback: this.showQR.bind(this)});
        this.showQRButtonGradient = DisplayObjectFactory.createNineSlicePlane("deposit/qr_gradient", 1, 1, 1, 1);
        this.showQRButtonText = new LanguageText({key: "Show QR", fontSize: 36, fill: 0x35F583, fontWeight: "500"});

        // Create a simple QR-like icon using graphics
        this.qrIcon = DisplayObjectFactory.createSprite("deposit/qr_icon");
        this.addressText = new LanguageText({
            key: "",
            fontSize: 40,
            fill: 0xF1F3FF,
            fontWeight: "500"
        });
        this.qrOverlay = new QRCodeOverlay();
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.qrCodeContainer);

        this.showQRButton.addChild(this.showQRButtonGradient);
        this.showQRButton.addChild(this.showQRButtonText);
        this.showQRButton.addChild(this.qrIcon);
        this.addChild(this.showQRButton);
        this.addChild(this.addressText);
        this.addChild(this.qrOverlay).show(false);
    }

    initChildren() {
        this.background.width = 960;
        this.background.height = 244;
        this.showQRButtonGradient.width = 782;
        this.showQRButtonGradient.height = 105;

        this.addressText.y = -60;
        this.qrCodeContainer.visible = false;

        Pivot.center(this.background);
        Pivot.center(this.showQRButtonGradient);
        Pivot.center(this.showQRButtonText);
        Pivot.center(this.qrIcon);

        this.qrIcon.x = -110;
        this.qrIcon.y = -32;
        this.showQRButtonGradient.y = this.showQRButtonText.y = -30;
        this.addressText.y = 65;
    }

    private async showQR() {
        this.qrOverlay.show(true);
    }

    applyData(address: string) {
        this.address = address;
        const truncatedAddress = this.address.length > 30
            ? `${this.address.substring(0, 15)}${this.address.substring(this.address.length - 15)}`
            : this.address;
        this.addressText.changeText(truncatedAddress);
        Pivot.center(this.addressText);
        this.qrOverlay.createQRCode(address);
    }

    destroy() {
        this.removeChild(this.background);
        this.removeChild(this.qrCodeContainer);
        this.removeChild(this.showQRButton);
        this.removeChild(this.addressText);

        this.showQRButton.removeChild(this.showQRButtonGradient);
        this.showQRButton.removeChild(this.showQRButtonText);
        this.showQRButton.removeChild(this.qrIcon);

        this.qrCodeContainer.removeChild(this.qrCodePlaceholder);

        this.background.destroy();
        this.qrCodeContainer.destroy();
        this.qrCodePlaceholder.destroy();
        this.showQRButtonGradient.destroy();
        this.showQRButtonText.destroy();
        this.qrIcon.destroy();
        this.showQRButton.destroy();
        this.addressText.destroy();

        this.background = null;
        this.qrCodeContainer = null;
        this.qrCodePlaceholder = null;
        this.showQRButton = null;
        this.showQRButtonGradient = null;
        this.showQRButtonText = null;
        this.qrIcon = null;
        this.addressText = null;

        super.destroy();
    }
}