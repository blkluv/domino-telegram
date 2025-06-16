import {Linear, Sine, TweenMax} from "gsap";
import {Filter, Sprite} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class Dust extends Sprite {
    private filter: Filter;

    constructor() {
        super();

        const fragment = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
void main(void)
{
   vec4 color = texture2D(uSampler, vTextureCoord);
                vec4 color2 = color;
                float a = 0.08;
                float a2 = 0.04;
                if(color.a > 0.5){
                    color2.rgba = vec4(a,a,a,a);
                } else if(color.a > 0.1){
                    color2.rgba = vec4(a2,a2,a2,a2);
                }else{
                    color2.rgba = vec4(0.0,0.0,0.0,0.0);
                }
                gl_FragColor = color2;
}
`;

        this.filter = new Filter(null, fragment);
        this.filters = [this.filter];
    }

    start(): void {
        for (let index: number = 0; index < 60; index++) {
            this.moveDust(DisplayObjectFactory.createSprite("table/dust"));
        }
    }

    destroy() {
        this.filters = null;

        this.filter.destroy();
        this.filter = null;

        super.destroy();
    }

    private async moveDust(dust: Sprite) {
        Pivot.center(dust);
        dust.scale.set(1.5 + Math.random() * .1);
        this.addChild(dust);
        dust.rotation = Math.random() * Math.PI * 2;
        await Promise.all([
            new Promise(resolve => TweenMax.to(dust.pivot, {duration: .2, x: 70, ease: Sine.easeOut, onComplete: resolve})),
            new Promise(resolve => TweenMax.to(dust, {duration: .2 + Math.random() * .2, alpha: 0, ease: Linear.easeNone, onComplete: resolve}))
        ]);
        this.removeChild(dust);
        dust.destroy();
    }
}