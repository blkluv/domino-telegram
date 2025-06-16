import {Spine} from "pixi-spine";
import {NineSlicePlane, Sprite, Text} from "pixi.js";
import {SitPlace} from "../../../../../dynamic_data/SitPlace";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {SpineFactory} from "../../../../../factories/SpineFactory";
import {TextFactory} from "../../../../../factories/TextFactory";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {CatAnimation} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Timeout} from "@azur-games/pixi-vip-framework";


export class Bubble extends Sprite {
    private back: NineSlicePlane;
    private text: Text;
    private img: Sprite;
    private spine: Spine;
    private textureName: string = "table/sit/domino";

    constructor(private sitPlace: SitPlace) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.visible = false;
    }

    destroy() {
        this.removeChild(this.back);
        this.removeChild(this.img);
        this.removeChild(this.spine);
        this.back.destroy();
        this.img.destroy();
        this.spine.destroy();
        this.back = null;
        this.img = null;
        this.spine = null;

        super.destroy();
    }

    async showText(value: string): Promise<void> {
        this.setText(value);
        let backSize: number = Math.max(300, this.text.width + 100);
        this.setBackSize(backSize, this.text.height + 100);
        let pivot: number = (backSize - 300) / 2;
        this.pivot.x = [SitPlace.TOP, SitPlace.RIGHT].includes(this.sitPlace) ? pivot : -pivot;
        this.text.visible = true;
        this.visible = true;
        await Timeout.seconds(2);
        this.visible = false;
        this.text.visible = false;
    }

    async showImg(): Promise<void> {
        this.img.visible = true;
        this.setBackSize(300);
        this.pivot.x = 0;
        this.visible = true;
        await Timeout.seconds(2);
        this.visible = false;
        this.img.visible = false;
    }

    async showSmile(smileId: string): Promise<void> {
        this.spine.state.setAnimation(0, smileId.split(":emoji-cat:")[1], true);
        this.setBackSize(200, 160);
        this.showSpine(true);
        this.visible = true;
        await Timeout.seconds(2);
        if (this._destroyed) {
            return;
        }
        this.visible = false;
        this.showSpine(false);
    }

    showSpine(value: boolean) {
        this.spine.visible = value;
        this.spine.state.timeScale = value ? 1 : 0;
    }

    setBackSize(width: number, height: number = 120): void {
        this.back.width = width;
        this.back.height = height;
        this.back.scale.x = 1;
        Pivot.center(this.back);
        if (this.sitPlace == SitPlace.RIGHT) {
            this.back.scale.x = -1;
        }
    }

    private createChildren() {
        let cornerSizes: number[] = this.sitPlace == SitPlace.TOP ? [91, 79, 74, 53] : [104, 66, 62, 68];
        this.back = DisplayObjectFactory.createNineSlicePlane("table/sit/bubble" + (this.sitPlace == SitPlace.TOP ? "_top" : ""), ...cornerSizes);
        this.text = TextFactory.createCommissioner({value: "", fontSize: 50, fill: 0x666666});
        this.img = new Sprite(LoaderService.getTexture(this.textureName));
        this.spine = SpineFactory.createCat(CatAnimation.Crazy);
    }

    private addChildren() {
        this.addChild(this.back);
        this.addChild(this.text).y = -5;
        this.addChild(this.img).y = -5;
        this.addChild(this.spine).y = -5;
    }

    private async initChildren() {
        Pivot.center(this.img);
        this.spine.scale.set(.5);
        this.text.visible = this.img.visible = false;
        this.showSpine(false);
    }

    private setText(value: string): void {
        this.text.text = value;
        Pivot.center(this.text);
    }
}