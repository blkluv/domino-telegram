import {Sprite, Text} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../../factories/TextFactory";
import {NumberUtils} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class ProfileSidebarField extends Sprite {
    private background: Sprite;
    valueText: Text;

    constructor(private bgTextureKey: string, private value: number) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.background = DisplayObjectFactory.createSprite(this.bgTextureKey);
        this.valueText = TextFactory.createCommissioner({value: NumberUtils.coinsKiloFormat(this.value), fontSize: 28, fill: 0xFFF5E0});
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.valueText);
    }

    initChildren() {
        this.valueText.style.stroke = 0x95835C;
        this.valueText.style.strokeThickness = 4;

        Pivot.center(this.valueText);
        Pivot.center(this.background);

        this.valueText.y = -1;
    }

    destroy() {
        this.removeChild(this.background);
        this.removeChild(this.valueText);

        this.background.destroy();
        this.valueText.destroy();

        this.background = null;
        this.valueText = null;

        super.destroy();
    }
}
