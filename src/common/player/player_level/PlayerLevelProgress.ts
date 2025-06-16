import {Clamp, DisplayObjectFactory, Pivot} from "@azur-games/pixi-vip-framework";
import {Linear, TweenMax} from "gsap";
import {Graphics, Point, Sprite} from "pixi.js";
import {DynamicData} from "../../../DynamicData";
import {GameEvents} from "../../../GameEvents";
import {PlayerData} from "../../../services/socket_service/socket_message_data/profile_data/PlayerData";


export class PlayerLevelProgress extends Sprite {
    public progressBackground: Sprite;
    private progressMask: Graphics;
    private innerCircleMask: Graphics;
    private onProfileUpdateBindThis: (e: MessageEvent) => void;
    private progressTween: TweenMax;
    private nextLevelProgress: number;
    private animationNextLevelProgress: number;
    private level: number;

    constructor(private textureName: string = "profile/player_level_progress", private progressStartAngle: number = Math.PI / 2) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.onProfileUpdateBindThis = this.onProfileUpdate.bind(this);
        addEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdateBindThis);
    }

    private _progress: number = 0;

    get progress(): number {
        return this._progress;
    }

    set progress(value: number) {
        if (!this.progressMask) {
            return;
        }
        this._progress = value;
        let newNextLevelProgress: number = this.nextLevelProgress;
        if (newNextLevelProgress < this.animationNextLevelProgress) {
            newNextLevelProgress += 1;
        }
        if (newNextLevelProgress * value > 1) {
            newNextLevelProgress -= 1;
        }
        let animationProgress: number = Clamp.between(newNextLevelProgress < this.animationNextLevelProgress ? 0 : this.animationNextLevelProgress, newNextLevelProgress * value, newNextLevelProgress);
        if (animationProgress == 1) {
            animationProgress = 0;
        }
        this.progressMask?.clear();
        this.progressMask.beginFill(0, 1)
            .lineStyle(0, 0)
            .arc(
                0,
                0,
                this.progressBackground.width / 2,
                this.progressStartAngle,
                this.progressStartAngle + Math.PI * 2 * animationProgress
            )
            .lineTo(0, 0)
            .endFill();
    }

    onProfileUpdate(): void {
        if (DynamicData.myProfile.level == this.level && DynamicData.myProfile.nextLevelProgress <= this.nextLevelProgress) {
            return;
        }
        this.level = DynamicData.myProfile.level;
        this.nextLevelProgress = DynamicData.myProfile.nextLevelProgress;

        this.progressTween?.kill();
        this.progressTween = TweenMax.to(this, 1, {
            progress: 1,
            ease: Linear.easeNone,
            onComplete: () => {
                this._progress = 0;
                this.animationNextLevelProgress = this.nextLevelProgress;
            }
        });
    }

    createChildren(): void {
        this.progressBackground = DisplayObjectFactory.createSprite(this.textureName);
        this.progressMask = new Graphics();
    }

    addChildren(): void {
        this.addChild(this.progressBackground);
        this.addChild(this.progressMask);
        this.progressBackground.mask = this.progressMask;
    }

    initChildren(): void {
        Pivot.center(this.progressBackground);
    }

    applyPlayerData(playerData: PlayerData): void {
        if (playerData.id != DynamicData.myProfile.id) {
            return;
        }
        this.nextLevelProgress = playerData.nextLevelProgress;
        this.animationNextLevelProgress = playerData.nextLevelProgress;
        this.level = playerData.level;

        this.progressMask.beginFill(0, 1)
            .lineStyle(0, 0)
            .arc(
                0,
                0,
                this.progressBackground.width / 2,
                this.progressStartAngle,
                this.progressStartAngle + Math.PI * 2 * this.nextLevelProgress
            )
            .lineTo(0, 0)
            .endFill();
    }

    createInnerCircleMask(maskWidthPercentage: number, maskCoords: Point = new Point(0, 0)): void {
        this.innerCircleMask = new Graphics()
            .beginFill(0, .0001)
            .drawCircle(0, 0, this.progressBackground.width / 2)
            .beginHole()
            .drawCircle(0, 0, this.progressBackground.width / 200 * maskWidthPercentage)
            .endHole()
            .endFill();
        this.innerCircleMask.x = maskCoords.x;
        this.innerCircleMask.y = maskCoords.y;
        this.addChild(this.innerCircleMask);
        this.mask = this.innerCircleMask;
    }

    destroy(): void {
        removeEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdateBindThis);
        this.onProfileUpdateBindThis = null;

        if (this.innerCircleMask) {
            this.removeChild(this.innerCircleMask);
            this.innerCircleMask.destroy();
            this.innerCircleMask = null;
        }

        this.removeChild(this.progressBackground);
        this.removeChild(this.progressMask);
        this.progressBackground.destroy();
        this.progressMask.destroy();
        this.progressBackground = null;
        this.progressMask = null;
        super.destroy();
    }
}
