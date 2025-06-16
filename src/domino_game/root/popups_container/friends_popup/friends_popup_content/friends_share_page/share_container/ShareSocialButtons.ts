import {Sprite} from "pixi.js";
import {ShareSocialButton} from "./share_social_buttons/ShareSocialButton";


export class ShareSocialButtons extends Sprite {
    private buttons: ShareSocialButton[] = [];
    private margin: number = 130;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.buttons.push(
            new ShareSocialButton(this.onWhatsUpClick.bind(this), "WhatsApp", "friends/whatsApp_icon"),
            new ShareSocialButton(this.onTelegramClick.bind(this), "Telegram", "friends/telegram_icon"),
            new ShareSocialButton(this.onViberClick.bind(this), "Viber", "friends/viber_icon"),
            new ShareSocialButton(this.onWeChatClick.bind(this), "WeChat", "friends/weChat_icon"),
            new ShareSocialButton(this.onLineClick.bind(this), "Line", "friends/line_icon"),
        );
    }

    addChildren(): void {
        this.buttons.forEach(btn => this.addChild(btn));
    }

    initChildren(): void {
        this.buttons.forEach((btn, i) => {
            btn.x = i * this.margin - 250;
        });
    }

    onWhatsUpClick() {

    }

    onTelegramClick() {

    }

    onViberClick() {

    }

    onWeChatClick() {

    }

    onLineClick() {

    }

    destroy(): void {
        let button: ShareSocialButton;
        while (this.buttons.length) {
            button = this.buttons.shift();
            this.removeChild(button);
            button.destroy();
        }
        super.destroy();
    }

}
