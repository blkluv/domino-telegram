import {NineSlicePlane, Sprite} from "pixi.js";
import {DisplayObjectFactory, Pivot, StageResizeListening} from "../../../../../../pixi-vip-framework";
import {DominoGame} from "../../../../app";


export class LobbyBackground extends StageResizeListening {
    private gradient: NineSlicePlane;
    private background: Sprite;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.onGameScaleChanged();
    }

    createChildren(): void {
        this.gradient = DisplayObjectFactory.createNineSlicePlane("lobby/bg_gradient", 10, 620, 10, 10);
        this.background = DisplayObjectFactory.createSprite("lobby/background");
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.gradient);
    }

    onGameScaleChanged() {
        this.gradient.width = DominoGame.instance.screenW;
        this.gradient.height = DominoGame.instance.screenH;
        this.background.width = DominoGame.instance.screenW;
        this.background.height = this.background.width * 0.815;

        Pivot.center(this.gradient);
        Pivot.center(this.background);

        this.background.y = -DominoGame.instance.screenH / 2 + this.background.height / 2;
    }

    destroy(): void {
        this.removeChild(this.gradient);
        this.removeChild(this.background);
        this.gradient.destroy();
        this.background.destroy();
        this.gradient = null;
        this.background = null;
        super.destroy();
    }
}
