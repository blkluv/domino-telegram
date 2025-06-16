import {BLEND_MODES, Sprite} from "pixi.js";
import {Linear, Sine, TweenMax} from "gsap";
import {WindowFocusController} from "@azur-games/pixi-vip-framework";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class DotsParticles extends Sprite {
    private particleInterval: number;
    private particles: Sprite[] = [];
    private particlesTweens: TweenMax[] = [];

    constructor(private dotsTextureName: string = "", private inASecond: number = 5, private distance: number = 300, private duration: number = 2, private count: number = 3) {
        super();
    }

    show(show: boolean) {
        window.clearInterval(this.particleInterval);
        show || this.clearParticles();
        if (show && this.dotsTextureName) {
            let count: number = this.inASecond;
            while (--count > 0) {
                this.createNewParticle(count / this.inASecond);
            }
            this.particleInterval = window.setInterval(() => this.createNewParticle(), 1000 / this.inASecond);
        }
    }

    destroy() {
        window.clearInterval(this.particleInterval);
        this.clearParticles();

        super.destroy();
    }

    private async createNewParticle(progress: number = 0) {
        if (!WindowFocusController.documentVisible) {
            return;
        }
        let particle: Sprite = new Sprite(LoaderService.getTexture(this.dotsTextureName + (this.count > 1 ? Math.ceil(Math.random() * this.count) : "")));
        Pivot.center(particle);
        particle.blendMode = BLEND_MODES.ADD;
        particle.rotation = Math.random() * Math.PI * 2;
        this.addChild(particle);
        this.particles.push(particle);
        let particleTween1: TweenMax;
        let particleTween2: TweenMax;
        await Promise.all([
            new Promise(resolve => {
                particleTween1 = TweenMax.to(particle.pivot, this.duration, {
                    y: this.distance + Math.random() * 50,
                    onComplete: resolve,
                    ease: Linear.easeNone
                });
                this.particlesTweens.push(particleTween1);
                particleTween1.progress(progress);
            }),
            new Promise(resolve => {
                particleTween2 = TweenMax.to(particle, this.duration, {
                    alpha: 0,
                    onComplete: resolve,
                    ease: Sine.easeIn
                });
                this.particlesTweens.push(particleTween2);
                particleTween2.progress(progress);
            })
        ]);
        this.removeChild(particle);
        this.particles.splice(this.particles.indexOf(particle), 1);
        this.particlesTweens.splice(this.particlesTweens.indexOf(particleTween1), 1);
        this.particlesTweens.splice(this.particlesTweens.indexOf(particleTween2), 1);
        particle.destroy();
    }

    private clearParticles() {
        let particle: Sprite;
        let tween: TweenMax;
        while (this.particlesTweens.length) {
            tween = this.particlesTweens.shift();
            tween.kill();
        }
        while (this.particles.length) {
            particle = this.particles.shift();
            this.removeChild(particle);
            particle.destroy();
        }
    }
}