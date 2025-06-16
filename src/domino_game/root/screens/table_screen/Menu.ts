import {Point} from "pixi.js";
import {DominoGame} from "../../../../app";
import {Button} from "@azur-games/pixi-vip-framework";
import {StageResizeListening} from "@azur-games/pixi-vip-framework";
import {MenuContainer} from "./menu/MenuContainer";


export class Menu extends StageResizeListening {
    private button: Button;
    private container: MenuContainer;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.onGameScaleChanged();
        this.openMenu(false);
    }

    createChildren(): void {
        this.button = new Button({
            callback: this.openMenu.bind(this, true),
            bgTextureName: "common/bg_button",
            iconTextureName: "table/menu/button",
            iconPosition: new Point(-1, 3)
        });
        this.container = new MenuContainer();
    }

    addChildren(): void {
        this.addChild(this.button);
        this.addChild(this.container);
    }

    onGameScaleChanged(): void {
        if (!this.button) {
            return;
        }
        let propsMinX: number = Math.min(DominoGame.instance.screenW / 2, 1600);
        let propsMinY: number = Math.min(DominoGame.instance.screenH / 2, 1400);

        this.button.x = propsMinX - 135;
        this.button.y = -propsMinY + 135;
        this.container.x = propsMinX - 190;
        this.container.y = -propsMinY + 203;
        this.container.overlayToOffset();
    }

    openMenu(value: boolean): void {
        this.container.show(value);
    }

    destroy(): void {
        this.removeChild(this.button);
        this.removeChild(this.container);
        this.button.destroy();
        this.container.destroy();
        this.button = null;
        this.container = null;
        super.destroy();
    }
}
