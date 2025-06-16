import {DisplayObjectFactory, LanguageService, Pivot, StageResizeListening} from "@azur-games/pixi-vip-framework";
import {Linear, TweenMax} from "gsap";
import {Sprite, Text} from "pixi.js";
import {DominoGame} from "../../../app";
import {TextFactory} from "../../../factories/TextFactory";
import {GameEvents} from "../../../GameEvents";
import {Declension} from "../../../utils/Declension";


export class MaintenanceAttention extends StageResizeListening {
    private background: Sprite;
    private attentionText: Text;
    private maintenanceStartsInText: Text;
    private centerContainer: Sprite;
    private intervalId: number;
    private between: number = 5;
    private finalMsec: number;
    private onLanguageChangeBindThis: (e: Event) => void;
    private showBindThis: (e: Event) => void;
    private hideBindThis: (e: Event) => void;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.interactive = this.interactiveChildren = false;
        this.onLanguageChangeBindThis = this.onLanguageChange.bind(this);
        this.showBindThis = this.show.bind(this);
        this.hideBindThis = this.hide.bind(this);
        addEventListener(GameEvents.SHOW_MAINTENANCE_NOTIFICATION, this.showBindThis);
        addEventListener(GameEvents.HIDE_MAINTENANCE_NOTIFICATION, this.hideBindThis);
        addEventListener(GameEvents.LANGUAGE_CHANGED, this.onLanguageChangeBindThis);
        this.scale.set(1.5);
        this.onGameScaleChanged();
        this.visible = false;
    }

    show(e: MessageEvent): void {
        let delaySec: number = e.data;
        this.alpha = 0;
        this.visible = true;
        TweenMax.to(this, 1, {alpha: 1, ease: Linear.easeNone});
        this.setTimer(delaySec);
    }

    hide(): void {
        this.visible = false;
        this.clearTimer();
    }

    private createChildren() {
        this.background = DisplayObjectFactory.createSprite("maintenance/bg_notification_server");
        this.attentionText = TextFactory.createCommissioner({fontSize: 25, fill: 0xffc400, fontWeight: "400"});
        this.maintenanceStartsInText = TextFactory.createCommissioner({fontSize: 20, fontWeight: "400"});
        this.centerContainer = DisplayObjectFactory.createSprite();
    }

    private initChildren() {
        this.attentionText.style.stroke = 0x777777;
        this.attentionText.style.strokeThickness = 2;
        this.maintenanceStartsInText.style.stroke = 0x777777;
        this.maintenanceStartsInText.style.strokeThickness = 2;

        Pivot.center(this.background, undefined, false);
        Pivot.center(this.centerContainer);

        this.centerContainer.y = 16;
    }

    private addChildren() {
        this.addChild(this.background);
        this.addChild(this.centerContainer);
        this.centerContainer.addChild(this.attentionText);
        this.centerContainer.addChild(this.maintenanceStartsInText);
    }

    onGameScaleChanged(): void {
        this.y = -DominoGame.instance.screenH / 2;
    }

    destroy() {
        removeEventListener(GameEvents.LANGUAGE_CHANGED, this.onLanguageChangeBindThis);
        removeEventListener(GameEvents.SHOW_MAINTENANCE_NOTIFICATION, this.showBindThis);
        removeEventListener(GameEvents.HIDE_MAINTENANCE_NOTIFICATION, this.hideBindThis);
        this.onLanguageChangeBindThis = null;
        this.showBindThis = null;
        this.hideBindThis = null;

        this.removeChild(this.background);
        this.removeChild(this.attentionText);
        this.removeChild(this.maintenanceStartsInText);
        this.removeChild(this.centerContainer);
        this.background.destroy();
        this.attentionText.destroy();
        this.maintenanceStartsInText.destroy();
        this.centerContainer.destroy();
        this.background = null;
        this.attentionText = null;
        this.maintenanceStartsInText = null;
        this.centerContainer = null;
        super.destroy();
    }

    setTimer(delaySec: number): void {
        this.finalMsec = delaySec * 1000 + Date.now();
        this.clearTimer();
        this.intervalId = window.setInterval(() => this.updateText(), 1000);
        this.updateText();
    }

    clearTimer() {
        this.intervalId && window.clearInterval(this.intervalId);
    }

    private updateText() {
        let minutes: number = Math.ceil((this.finalMsec - Date.now()) / 60000);
        let plural: string = Declension.getPluralDeclensionForMinutes(minutes);
        this.maintenanceStartsInText.text = LanguageService.getTextByKey("Maintenance.starts-in", [plural]);
        this.attentionText.text = LanguageService.getTextByKey("Maintenance.attention");
        Pivot.center(this.attentionText, false);
        Pivot.center(this.maintenanceStartsInText, false);
        this.maintenanceStartsInText.x = this.attentionText.width + this.between;
        let textWidth = this.attentionText.width + this.between + this.maintenanceStartsInText.width;
        this.centerContainer.x = -textWidth / 2;

        if (Date.now() > this.finalMsec) {
            window.clearInterval(this.intervalId);
            this.visible = false;
        }
    }

    private onLanguageChange() {
        this.updateText();
    }
}