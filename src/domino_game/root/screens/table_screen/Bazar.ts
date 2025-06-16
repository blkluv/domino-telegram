import gsap, {Sine} from "gsap";
import {DominoGame} from "../../../../app";
import {StageResizeListening} from "@azur-games/pixi-vip-framework";
import {GameStateData} from "../../../../data/active_data/GameStateData";
import {GameEvents} from "../../../../GameEvents";
import {BazarIcon} from "./bazar/BazarIcon";
import {BazarWindow} from "./bazar/BazarWindow";


export class Bazar extends StageResizeListening {
    private icon: BazarIcon;
    private window: BazarWindow;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.onGameScaleChanged();
    }

    private createChildren(): void {
        this.icon = new BazarIcon();
        this.window = new BazarWindow();
    }

    onGameScaleChanged(): void {
        this.icon.x = DominoGame.instance.screenW / 2 - 100;
        dispatchEvent(new MessageEvent(GameEvents.BAZAR_ICON_RESIZED, {data: this.icon}));
    }

    private addChildren(): void {
        this.addChild(this.icon);
    }

    setGameStateData(socketGameState: GameStateData): void {
        this.icon.setGameStateData(socketGameState);
        this.window.setGameStateData(socketGameState);
    }

    jump(): void {
        gsap.to(this.icon.scale, {duration: .1, x: 1.4, y: 1.4, ease: Sine.easeOut, yoyo: true, repeat: 1});
    }

    redraw(): void {
        this.window.redraw();
    }

    destroy(): void {
        this.removeChild(this.icon);
        this.icon.destroy();
        this.window.destroy();
        this.icon = null;
        this.window = null;
        super.destroy();
    }

}