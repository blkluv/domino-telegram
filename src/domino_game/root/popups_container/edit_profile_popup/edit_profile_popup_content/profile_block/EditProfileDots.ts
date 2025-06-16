import {Sprite} from "pixi.js";
import {EditProfileDot} from "./edit_profile_dots/EditProfileDot";


export class EditProfileDots extends Sprite {
    private dotsAmount: number = 20;
    private dots: EditProfileDot[] = [];

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        for (let i = 1; i < this.dotsAmount; i++) {
            this.dots.push(new EditProfileDot());
        }
    }

    addChildren(): void {
        this.dots.forEach(dot => this.addChild(dot));
    }

    initChildren(): void {
        this.dots.forEach(dot => {
            dot.y = Math.random() * 401 - 200;
            dot.x = Math.random() * 401 - 200;
        });
    }

    destroy(): void {
        let dot: EditProfileDot;
        while (this.dots.length) {
            dot = this.dots.shift();
            this.removeChild(dot);
            dot.destroy();
        }
        this.dots = null;

        super.destroy();
    }
}
