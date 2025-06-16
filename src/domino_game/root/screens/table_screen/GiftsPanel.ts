import {Sine} from "gsap";
import {TweenMax} from "gsap/gsap-core";
import {ScreenCovering} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {GiftsList} from "./gifts_panel/GiftsList";


export class GiftsPanel extends ScreenCovering {
    private giftsList: GiftsList;
    private alphaTween: TweenMax;
    private onOpenGiftsPanelBindThis: (e: MessageEvent) => void;
    private onCloseGiftsPanelBindThis: (e: MessageEvent) => void;
    static playerID: number;

    constructor() {
        super(0, true);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onCloseGiftsPanelBindThis = this.onCloseGiftsPanel.bind(this);
        this.onOpenGiftsPanelBindThis = this.onOpenGiftsPanel.bind(this);
        addEventListener(GameEvents.OPEN_GIFTS_PANEL, this.onOpenGiftsPanelBindThis);
        addEventListener(GameEvents.CLOSE_GIFTS_PANEL, this.onCloseGiftsPanelBindThis);
    }

    onOpenGiftsPanel(e: MessageEvent): void {
        GiftsPanel.playerID = e.data;
        this.show(true);
    }

    onCloseGiftsPanel(): void {
        this.show(false);
    }

    createChildren(): void {
        this.giftsList = new GiftsList();
    }

    addChildren(): void {
        this.addChild(this.giftsList);
    }

    initChildren(): void {
        this.giftsList.y = 200;
    }

    onOverlayClick(): void {
        this.show(false);
    }

    show(value: boolean): void {
        this.alphaTween?.kill();
        value && (this.visible = true);
        this.alphaTween = TweenMax.to(this, {
            duration: .3,
            alpha: value ? 1 : 0,
            ease: Sine.easeInOut,
            onComplete: () => {
                value || (this.visible = false);
            }
        });
        this.giftsList.list.forEach(item => item.enabled = value);
    }

    destroy(): void {
        removeEventListener(GameEvents.OPEN_GIFTS_PANEL, this.onOpenGiftsPanelBindThis);
        removeEventListener(GameEvents.CLOSE_GIFTS_PANEL, this.onCloseGiftsPanelBindThis);
        this.onCloseGiftsPanelBindThis = null;
        this.onOpenGiftsPanelBindThis = null;

        this.alphaTween?.kill();
        this.alphaTween = null;

        this.removeChild(this.giftsList);
        this.giftsList.destroy();
        this.giftsList = null;
        super.destroy();
    }
}
