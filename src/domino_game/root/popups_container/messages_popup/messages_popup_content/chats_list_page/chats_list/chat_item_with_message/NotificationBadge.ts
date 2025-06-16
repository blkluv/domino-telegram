import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class NotificationBadge extends Sprite {
    private background: Sprite;
    private text: LanguageText;

    constructor(private textValue: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("common/notification_badge");
        this.text = new LanguageText({key: this.textValue, fontSize: 32, autoFitWidth: 50});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.text);
    }

    initChildren(): void {
        this.text.setTextStroke(0x8A1717, 3);
        Pivot.center(this.background);

        this.background.y = 7;
    }

    changeValue(value: string): void {
        this.text.changeText(value);
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.text);

        this.background.destroy();
        this.text.destroy();

        this.background = null;
        this.text = null;

        super.destroy();
    }
}
