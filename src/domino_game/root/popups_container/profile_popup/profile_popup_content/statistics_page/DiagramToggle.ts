import {Linear, TweenMax} from "gsap";
import {Sprite} from "pixi.js";
import {ButtonBase} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class DiagramToggle extends ButtonBase {
    private moveTogglerTween: TweenMax;
    private toggled: boolean = true;
    private background: Sprite;
    private toggler: Sprite;
    private toggledText: LanguageText;
    private notToggledText: LanguageText;
    private togglerLeftPosition: number = -53;
    private togglerRightPosition: number = 53;

    constructor(private onToggle: (value: boolean) => void) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("profile/switcher_small_bg");
        this.toggler = DisplayObjectFactory.createSprite("profile/switcher_small_slider");
        this.toggledText = new LanguageText({key: "Profile/GamesPlayed", fontSize: 20, fill: 0x95835F, autoFitWidth: 70, fontWeight: "600"});
        this.notToggledText = new LanguageText({key: "Profile/WinRate", fontSize: 20, fill: 0x95835F, autoFitWidth: 70, fontWeight: "600"});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.toggler);
        this.addChild(this.toggledText);
        this.addChild(this.notToggledText);
    }

    initChildren(): void {
        Pivot.center(this.background);
        Pivot.center(this.toggler);
        Pivot.center(this.toggledText);
        Pivot.center(this.notToggledText);

        this.toggler.x = this.togglerRightPosition;
        this.toggler.y = -1;
        this.toggledText.x = -37;
        this.notToggledText.x = 37;
        this.toggledText.y = this.notToggledText.y = -3;

        this.toggledText.visible = this.toggled;
        this.notToggledText.visible = !this.toggled;
    }

    async processClick(): Promise<void> {
        this.playSound();
        this.toggled = !this.toggled;
        this.toggledText.visible = false;
        this.notToggledText.visible = false;

        this.moveTogglerTween?.kill();
        await new Promise(resolve => this.moveTogglerTween = TweenMax.to(this.toggler, .3, {
            ease: Linear.easeInOut,
            x: this.toggled ? this.togglerRightPosition : this.togglerLeftPosition,
            onComplete: resolve
        }));
        this.toggledText.visible = this.toggled;
        this.notToggledText.visible = !this.toggled;

        this.onToggle(this.toggled);
    }

    destroy(): void {
        this.moveTogglerTween?.kill();
        this.moveTogglerTween = null;

        this.removeChild(this.background);
        this.removeChild(this.toggler);
        this.removeChild(this.toggledText);
        this.removeChild(this.notToggledText);

        this.background.destroy();
        this.toggler.destroy();
        this.toggledText.destroy();
        this.notToggledText.destroy();

        this.background = null;
        this.toggler = null;
        this.toggledText = null;
        this.notToggledText = null;

        super.destroy();
    }
}
