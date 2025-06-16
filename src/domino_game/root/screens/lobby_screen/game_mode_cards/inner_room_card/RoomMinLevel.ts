import {NineSlicePlane, Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class RoomMinLevel extends Sprite {
    private background: NineSlicePlane;
    private lockIcon: Sprite;
    private minLevelText: LanguageText;

    constructor(private minLevel: number) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("lobby/min_level_bg", 50, 50, 50, 50);
        this.lockIcon = DisplayObjectFactory.createSprite("lobby/icon_padlock");
        this.minLevelText = new LanguageText({key: "Lobby/min-level", fontSize: 34, placeholders: [this.minLevel.toString()]});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.lockIcon);
        this.addChild(this.minLevelText);
    }

    initChildren(): void {
        this.y = -5;

        this.background.width = 300;
        this.background.height = 486;

        this.minLevelText.setTextStroke(0x187ABE, 3);

        Pivot.center(this.background);
        Pivot.center(this.lockIcon);
        Pivot.center(this.minLevelText);

        this.lockIcon.y = -30;
        this.minLevelText.y = 30;
    }

    destroy(): void {
        this.removeChild(this.lockIcon);
        this.removeChild(this.minLevelText);

        this.lockIcon.destroy();
        this.minLevelText.destroy();

        this.lockIcon = null;
        this.minLevelText = null;

        super.destroy();
    }
}
