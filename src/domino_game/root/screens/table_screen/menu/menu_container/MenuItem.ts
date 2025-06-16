import {NineSlicePlane, Sprite} from "pixi.js";
import {ButtonBase, DisplayObjectFactory, LanguageText, Pivot, LoaderService} from "@azur-games/pixi-vip-framework";


export class MenuItem extends ButtonBase {
    background: NineSlicePlane;
    private icon: Sprite;
    private text: LanguageText;
    private switchStateText: LanguageText;

    constructor(callback: Function,
                private textKey: string,
                private iconTexture: string,
                private switchable?: boolean,
                public switched?: boolean,
                withCooldown: boolean = false
    ) {
        super(callback, undefined, undefined, withCooldown);
        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.switchable && this.switch(switched);
        this.enabled = !!callback;
        callback || (this.alpha = .6);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("table/menu/item_bg");
        this.icon = DisplayObjectFactory.createSprite(this.iconTexture);
        this.text = new LanguageText({
            key: this.textKey,
            fontSize: 30,
            fontWeight: "700",
            fill: 0xEACEFF,
        });
        this.switchStateText = new LanguageText({
            key: "",
            fontSize: 30,
            fontWeight: "700",
        });
    }

    addChildren(): void {
        this.addChild(this.background).visible = this.switchable;
        this.addChild(this.icon);
        this.addChild(this.text);
        this.addChild(this.switchStateText).visible = this.switchable;
    }

    initChildren(): void {
        this.background.width = 290;
        this.background.height = 70;
        this.text.setTextStroke(0x2F0E56, 3, false);
        this.switchStateText.setTextStroke(0x2F0E56, 3, false);

        Pivot.center(this.background);
        Pivot.center(this.icon);
        Pivot.center(this.text, false, true);
        Pivot.center(this.switchStateText, false, true);

        this.icon.x = -110;
        this.text.x = -70;
    }

    switch(value: boolean): void {
        this.switched = value;
        this.switchStateText.changeText("TableSettingsWindow/" + (value ? "on" : "off"), false);
        this.switchStateText.style.fill = value ? 0xFCBC5C : 0xFC615C;
        this.icon.texture = LoaderService.getTexture(this.iconTexture + (value ? "" : "_off"));
        Pivot.center(this.icon);

        let textCommonWidth: number = this.switchStateText.width + this.text.width;
        let textCommonScale = textCommonWidth > 180 ? 180 / textCommonWidth : 1;
        this.switchStateText.scale.set(textCommonScale);
        this.text.scale.set(textCommonScale);
        this.switchStateText.x = this.text.x + this.text.width + 5;
        this.background.visible = value;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.icon);
        this.removeChild(this.text);
        this.removeChild(this.switchStateText);

        this.background.destroy();
        this.icon.destroy();
        this.text.destroy();
        this.switchStateText.destroy();

        this.background = null;
        this.icon = null;
        this.text = null;
        this.switchStateText = null;

        super.destroy();
    }
}
