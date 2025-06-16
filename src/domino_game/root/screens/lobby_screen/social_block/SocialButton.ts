import {Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class SocialButton extends Button {
    private notificationBadge: Sprite;

    constructor(callback: Function, iconTextureName: string) {
        super({
            callback,
            bgTextureName: "lobby/plate_bubble_mini",
            iconTextureName
        });
        this.createNotificationBadge();
    }

    private createNotificationBadge(): void {
        this.notificationBadge = DisplayObjectFactory.createSprite("lobby/red_dot");
        this.addChild(this.notificationBadge).visible = false;
        Pivot.center(this.notificationBadge);
        this.notificationBadge.y = -33;
        this.notificationBadge.x = 33;
    }

    showNotification(value: boolean): void {
        this.notificationBadge.visible = value;
    };

    onConnectionChange(e: MessageEvent) {
        let connected: boolean = e.data;
        this.enabled = connected;
        this.backgroundImage.alpha = connected ? 1 : .5;
    }

    destroy() {
        if (this.notificationBadge) {
            this.removeChild(this.notificationBadge);
            this.notificationBadge.destroy();
            this.notificationBadge = null;
        }
        super.destroy();
    }
}