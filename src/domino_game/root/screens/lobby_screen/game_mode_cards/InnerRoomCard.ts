import {Back, TweenMax} from "gsap/gsap-core";
import {InteractionEvent, NineSlicePlane, Rectangle, Sprite} from "pixi.js";
import {HoverableObject} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {SocketGameConfig} from "../../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {PlayButton} from "./inner_room_card/PlayButton";
import {RoomHeader} from "./inner_room_card/RoomHeader";
import {RoomMinLevel} from "./inner_room_card/RoomMinLevel";
import {RoomTarget} from "./inner_room_card/RoomTarget";


export class InnerRoomCard extends HoverableObject {
    private back: NineSlicePlane;
    private cardsRoomPlate: NineSlicePlane;
    private icon: Sprite;
    private header: RoomHeader;
    private target: RoomTarget;
    private playButton: PlayButton;
    private minLevel: RoomMinLevel;
    private selector: NineSlicePlane;
    private selectorTween: gsap.core.Tween;
    private backWidth: number = 313;
    private backHeight: number = 500;
    private endless: boolean;
    private myLevelIsOk: boolean;

    constructor(private config: SocketGameConfig) {
        super();
        this.endless = this.config.gameType.includes("endless");
        this.myLevelIsOk = this.config.minLevel <= DynamicData.myProfile.level;
        this.interactive = this.interactiveChildren = this.buttonMode = this.myLevelIsOk;

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.selector = DisplayObjectFactory.createNineSlicePlane("lobby/eye", 63);
        this.selector.width = this.backWidth + 50;
        this.selector.height = this.backHeight + 50;
        Pivot.center(this.selector);
        this.addChild(this.selector).y = -6;
        this.selector.interactive = false;
        this.setSelectorVisible(false);
    }

    onPointerOver(_?: InteractionEvent): void {
        this.setSelectorVisible(this.myLevelIsOk);
    }

    /**
     * Обработчик события pointerout
     * @param e Событие взаимодейтсвия пользователя
     */
    onPointerOut(_?: InteractionEvent): void {
        this.setSelectorVisible(false);
    }

    destroy(): void {
        this.config = null;

        this.selectorTween?.kill();
        this.removeChild(this.selector);
        this.selector.destroy();
        this.selector = undefined;
        this.selectorTween = undefined;

        this.removeChild(this.back);
        this.removeChild(this.cardsRoomPlate);
        this.removeChild(this.icon);
        this.removeChild(this.header);
        this.removeChild(this.target);
        this.removeChild(this.minLevel);

        this.back.destroy();
        this.cardsRoomPlate.destroy();
        this.icon.destroy();
        this.header.destroy();
        this.target.destroy();
        this.minLevel.destroy();

        this.back = undefined;
        this.cardsRoomPlate = undefined;
        this.icon = undefined;
        this.header = undefined;
        this.target = undefined;
        this.minLevel = undefined;

        super.destroy();
    }

    private async setSelectorVisible(value: boolean): Promise<void> {
        if (!this.selector) {
            return;
        }
        this.selector.interactive = false;
        value && (this.selector.visible = true);
        if (value) {
            this.selector.alpha = value ? 0 : 1;
            this.selector.visible = true;
            this.selector.width = this.backWidth + 20;
            this.selector.height = this.backHeight + 20;
            this.selector.hitArea = new Rectangle(0, 0, 0, 0);
            this.parent.setChildIndex(this, value ? 0 : 5);
            this.selector.interactive = this.selector.interactiveChildren = false;
        }
        await new Promise(resolve => this.selectorTween = TweenMax.to(this.selector, {
            alpha: value ? 1 : 0,
            duration: .3,
            width: this.backWidth + 30,
            height: this.backHeight + 30,
            onUpdate: () => {
                Pivot.center(this.selector);
                this.back.scale.set(
                    1.02 + this.selectorTween.progress() * (value ? .02 : -.02),
                    1.016 + this.selectorTween.progress() * (value ? .016 : -.016)
                );
            },
            ease: Back.easeOut,
            onComplete: resolve
        }));
    }

    private createChildren(): void {
        this.back = DisplayObjectFactory.createNineSlicePlane("lobby/room_card_bg", 50, 50, 50, 50);
        this.cardsRoomPlate = DisplayObjectFactory.createNineSlicePlane("lobby/cards_room_plate", 37, 37, 37, 37);
        this.icon = DisplayObjectFactory.createSprite(this.iconTexture);
        this.header = new RoomHeader(this.config);
        this.target = new RoomTarget(this.config);
        this.playButton = new PlayButton(this.config, this.endless);
        this.minLevel = new RoomMinLevel(this.config.minLevel);
    }

    get iconTexture(): string {
        if (this.endless) {
            return "lobby/king_mode_icon_" + this.config.gameType.slice(-1);
        }
        return "lobby/bundle_soft";
    }

    private addChildren(): void {
        this.addChild(this.back);
        this.addChild(this.cardsRoomPlate);
        this.addChild(this.icon);
        this.addChild(this.header);
        this.addChild(this.target);
        this.addChild(this.playButton);
        this.addChild(this.minLevel).visible = !this.myLevelIsOk;
    }

    private initChildren(): void {
        this.scale.set(1.13);

        this.back.width = this.backWidth;
        this.back.height = this.backHeight;

        this.cardsRoomPlate.width = 265;
        this.cardsRoomPlate.height = this.endless ? 320 : 280;

        this.cardsRoomPlate.y = -230;

        this.icon.scale.set(this.endless ? .75 : .85);
        this.icon.y = this.endless ? -30 : -45;

        this.header.y = -178;

        this.target.visible = !this.endless;
        this.target.y = 80;

        this.playButton.y = 160;

        Pivot.center(this.back);
        Pivot.center(this.cardsRoomPlate, true, false);
        Pivot.center(this.icon);
    }
}
