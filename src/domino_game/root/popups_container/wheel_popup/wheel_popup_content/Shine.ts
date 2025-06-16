import {Sprite} from "pixi.js";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {DotsParticles} from "./shine/DotsParticles";


export class Shine extends Sprite {
    private rays1: Sprite;
    private rays2: Sprite;
    private shown: boolean;
    private dotsParticles: DotsParticles;

    constructor(private raysTextureName: string, private dotsTextureName: string = "") {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.show(false);
    }

    private createChildren() {
        this.dotsParticles = new DotsParticles(this.dotsTextureName);
        this.rays1 = new Sprite(LoaderService.getTexture(this.raysTextureName));
        this.rays2 = new Sprite(LoaderService.getTexture(this.raysTextureName));

        //this.rays1.blendMode = BLEND_MODES.ADD;
        //this.rays2.blendMode = BLEND_MODES.ADD;
    }

    private addChildren() {
        this.addChild(this.rays1);
        this.addChild(this.dotsParticles);
        this.addChild(this.rays2).alpha = .5;
    }

    private initChildren() {
        Pivot.center(this.dotsParticles);
        Pivot.center(this.rays1);
        Pivot.center(this.rays2);
    }

    show(show: boolean) {
        if (this.shown == show) {
            return;
        }
        this.rays1.visible = show;
        this.rays2.visible = show;
        this.shown = show;
        show && this.onEnterFrame();
        this.dotsTextureName && this.dotsParticles.show(show);
    }

    destroy() {
        this.shown = false;

        this.removeChild(this.dotsParticles);
        this.removeChild(this.rays1);
        this.removeChild(this.rays2);

        this.dotsParticles.destroy();
        this.rays1.destroy();
        this.rays2.destroy();

        this.dotsParticles = null;
        this.rays1 = null;
        this.rays2 = null;

        super.destroy();
    }

    private onEnterFrame() {
        if (!this.shown) {
            return;
        }
        this.rays1.rotation = Date.now() / 5000;
        this.rays2.rotation = -this.rays1.rotation + 50;
        // this.rays2.rotation = -this.rays1.rotation;
        requestAnimationFrame(() => this.onEnterFrame());
    }
}