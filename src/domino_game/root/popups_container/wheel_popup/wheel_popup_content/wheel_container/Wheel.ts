import {Sine, TweenMax} from "gsap";
import {Spine} from "pixi-spine";
import {Sprite} from "pixi.js";
import {DynamicData} from "../../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {WheelAnimation} from "../../../../../../factories/spine_factory/WheelAnimation";
import {SpineFactory} from "../../../../../../factories/SpineFactory";
import {WheelSector} from "../../../../../../services/socket_service/socket_message_data/wheel_config/WheelSector";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {WheelField} from "./wheel/WheelField";


export class Wheel extends Sprite {
    private rotationTween: TweenMax;
    private body: Sprite;
    private shadow: Sprite;
    private spine: Spine;
    private field: WheelField;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.body = DisplayObjectFactory.createSprite("wheel/wheel");
        this.shadow = DisplayObjectFactory.createSprite("wheel/shadow");
        this.field = new WheelField();
        this.spine = SpineFactory.createWheelSpin();
    }

    addChildren(): void {
        this.addChild(this.body);
        this.addChild(this.field);
        this.addChild(this.shadow);
        this.addChild(this.spine);
    }

    initChildren(): void {
        this.spine.scale.set(.81);

        Pivot.center(this.body);
        Pivot.center(this.shadow);
        this.spine.y = -3;
    }

    async animateSpin(targetSector: WheelSector): Promise<void> {
        this.spine.state.setAnimation(0, WheelAnimation.ACTION, false);
        let targetAngleCoefficient: number = DynamicData.wheel.sectors.length - DynamicData.wheel.sectors.findIndex(sector => sector.coins == targetSector.coins);
        this.rotationTween?.kill();
        await new Promise(resolve => this.rotationTween = TweenMax.to(this.field, 3, {
            rotation: Math.PI * 2 + (Math.PI / 5 * targetAngleCoefficient),
            ease: Sine.easeOut,
            onComplete: resolve,
        }));
    }

    activate(value: boolean): void {
        this.spine.state.setAnimation(0, value ? WheelAnimation.IDLE_ACTIVE : WheelAnimation.IDLE_INACTIVE, true);
    }

    destroy(): void {
        this.spine.state.timeScale = 0;

        this.rotationTween?.kill();
        this.rotationTween = null;

        this.removeChild(this.body);
        this.removeChild(this.field);
        this.removeChild(this.shadow);
        this.removeChild(this.spine);

        this.body.destroy();
        this.field.destroy();
        this.shadow.destroy();
        this.spine.destroy();

        this.body = null;
        this.field = null;
        this.shadow = null;
        this.spine = null;

        super.destroy();
    }
}
