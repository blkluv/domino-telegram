import {Back, TweenMax} from "gsap";
import {InteractionEvent} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class BackButton extends Button {
    onPointerOver(e: InteractionEvent): void {
        TweenMax.to(this.backgroundImage, {
            duration: .2, width: this.backgroundImage.texture.width + 40, ease: Back.easeOut, onUpdate: () => {
                Pivot.center(this.backgroundImage);
            }
        });
    }

    onPointerOut(e: InteractionEvent): void {
        TweenMax.to(this.backgroundImage, {
            duration: .2, width: this.backgroundImage.texture.width, onUpdate: () => {
                Pivot.center(this.backgroundImage);
            }
        });
    }

    onPointerUp(e: InteractionEvent): void {
        this.onPointerOut(null);
        super.onPointerUp(e);
    }
}