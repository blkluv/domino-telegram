import {Back, TweenMax} from "gsap";
import {NineSlicePlane, Sprite} from "pixi.js";
import {DominoGame} from "../../../../../app";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../GameEvents";

import {Pivot} from "@azur-games/pixi-vip-framework";


export class TableChatPanel extends Sprite {
    private showTween: TweenMax;
    private background: NineSlicePlane;
    private closeButton: Button;
    private title: LanguageText;
    protected items: Button[];

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.resize();
        this.pivot.x = -500;
        this.background.interactive = true;
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("table/chat/BG", 25, 25, 25, 35);
        this.closeButton = new Button({callback: this.onClose.bind(this), bgTextureName: "common/button_close"});
        this.title = new LanguageText({key: "CHAT", fontSize: 56, fill: [0xFFF7EB, 0xE8CCA5]});
    }

    addChildren(): void {
        this.addChild(this.background).alpha = .95;
        this.addChild(this.closeButton);
        this.addChild(this.title);
    }

    initChildren(): void {
        this.title.setTextStroke(0x8E617F, 6);
        Pivot.center(this.title);
        this.title.y = 70;
        this.closeButton.y = 77;
        this.closeButton.x = 170;
    }

    resize(): void {
        this.y = -DominoGame.instance.screenH / 2;
        this.x = DominoGame.instance.screenW / 2 - 245;
        this.background.height = DominoGame.instance.screenH + 10;
        this.background.width = 500;
        Pivot.center(this.background, true, false);
    }

    onClose(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_TABLE_CHAT));
    }

    show(show: boolean) {
        this.showTween?.kill();
        this.showTween = TweenMax.to(this.pivot, .5, {
            x: show ? 0 : -500,
            ease: show ? Back.easeOut : Back.easeIn,
        });
        this.items.forEach(item => {
            item.enabled = show;
            show && (item.brightness = 1);
        });
    }

    destroy(): void {
        this.showTween?.kill();
        this.showTween = null;

        this.removeChild(this.background);
        this.removeChild(this.closeButton);
        this.removeChild(this.title);

        this.background.destroy();
        this.closeButton.destroy();
        this.title.destroy();

        this.background = null;
        this.closeButton = null;
        this.title = null;

        super.destroy();
    }
}
