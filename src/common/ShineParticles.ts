import {DisplayObjectFactory, Pivot, WindowFocusController} from "@azur-games/pixi-vip-framework";
import {Linear, Sine, TweenMax} from "gsap";
import {Rectangle, Sprite} from "pixi.js";
import {GameEvents} from "../GameEvents";


export class ShineParticles extends Sprite {
    private particleInterval: number;
    private particles: Sprite[] = [];
    private particlesTweens: TweenMax[] = [];
    private onWindowFocusChangedBindThis: (e: MessageEvent) => void;

    constructor(private dotsTextureName: string = "lots/star", private inASecond: number = 3, private box: Rectangle = new Rectangle(), private duration: number = .6) {
        super();
        this.show(true);
        this.onWindowFocusChangedBindThis = this.onWindowFocusChanged.bind(this);
        addEventListener(GameEvents.FOCUS_CHANGED, this.onWindowFocusChangedBindThis);
    }

    onWindowFocusChanged(): void {
        this.show(WindowFocusController.focused);
    }

    show(show: boolean): void {
        window.clearInterval(this.particleInterval);
        show ? this.launchParticles() : this.clearParticles();
    }

    destroy(): void {
        removeEventListener(GameEvents.FOCUS_CHANGED, this.onWindowFocusChangedBindThis);
        this.onWindowFocusChangedBindThis = null;
        this.box = null;

        window.clearInterval(this.particleInterval);
        this.clearParticles();

        super.destroy();
    }

    private async createNewParticle(progress: number = 0): Promise<void> {
        let particle: Sprite = DisplayObjectFactory.createSprite(this.dotsTextureName);
        Pivot.center(particle);
        particle.x = this.box.x + Math.random() * this.box.width;
        particle.y = this.box.y + Math.random() * this.box.height;
        particle.scale.set(0);
        particle.alpha = 0;
        this.addChild(particle);
        this.particles.push(particle);
        let particleTween1: TweenMax;
        let particleTween2: TweenMax;
        let particleTween3: TweenMax;
        let goScale: number = 1 + Math.random() * .3;
        let goY: number = particle.y - 10 - Math.random() * 10;
        await Promise.all([
            new Promise(resolve => {
                particleTween1 = TweenMax.to(particle.scale, this.duration, {
                    x: goScale,
                    y: goScale,
                    yoyo: true,
                    repeat: 1,
                    onComplete: resolve,
                    ease: Sine.easeOut
                });
                this.particlesTweens.push(particleTween1);
                particleTween1.progress(progress);
            }),
            new Promise(resolve => {
                particleTween2 = TweenMax.to(particle, this.duration, {
                    alpha: 1,
                    yoyo: true,
                    repeat: 1,
                    onComplete: resolve,
                    ease: Sine.easeOut
                });
                this.particlesTweens.push(particleTween2);
                particleTween2.progress(progress);
            }),
            new Promise(resolve => {
                particleTween3 = TweenMax.to(particle, this.duration * 2, {
                    y: goY,
                    onComplete: resolve,
                    ease: Linear.easeNone
                });
                this.particlesTweens.push(particleTween3);
                particleTween3.progress(progress);
            })
        ]);
        this.removeChild(particle);
        this.particles.splice(this.particles.indexOf(particle), 1);
        this.particlesTweens.splice(this.particlesTweens.indexOf(particleTween1), 1);
        this.particlesTweens.splice(this.particlesTweens.indexOf(particleTween2), 1);
        this.particlesTweens.splice(this.particlesTweens.indexOf(particleTween3), 1);
        particle.destroy();
    }

    private launchParticles(): void {
        let count: number = this.inASecond;
        while (--count > 0) {
            this.createNewParticle(count / this.inASecond);
        }
        this.particleInterval = window.setInterval(() => this.createNewParticle(), 1000 / this.inASecond);
    }

    private clearParticles(): void {
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