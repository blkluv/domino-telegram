import {Back, TweenMax} from "gsap/gsap-core";
import {Spine} from "pixi-spine";
import {InteractionEvent, NineSlicePlane, Point, Rectangle} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {LobbySpineName} from "../../../../../factories/spine_factory/LobbySpineName";
import {SpineFactory} from "../../../../../factories/SpineFactory";
import {GameMode} from "../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class GameModeCard extends Button {
    private spine: Spine;
    private selector: NineSlicePlane;
    private selectorTween: gsap.core.Tween;

    //private lights: LobbyLights;

    constructor(private callback: (gameMode: GameMode) => void, iconTextureName: string, spineName: LobbySpineName, public gameMode: GameMode) {
        super({
                callback: onClick,
                bgTextureName: "lobby/cards_gold",
                bgCornersSize: [75, 75, 75, 100],
                bgSizes: new Point(370, 600),
                iconTextureName,
                iconPosition: new Point(0, -58),
                textKey: "Lobby/GameMode/" + gameMode.toUpperCase(),
                fontSize: 42,
                fontColor: 0x926746,
                textPosition: new Point(0, 210),
                autoFitWidth: 280,
                disabledOffline: true
            }
        );
        let _this = this;

        function onClick(): void {
            _this.callback(_this.gameMode);
        }

        this.selector = DisplayObjectFactory.createNineSlicePlane("lobby/eye", 63);
        this.selector.width = this.props.bgSizes.x + 60;
        this.selector.height = this.props.bgSizes.y + 60;
        Pivot.center(this.selector);
        this.addChild(this.selector);
        this.selector.interactive = false;
        this.setSelectorVisible(false);

        this.spine = SpineFactory.createLobbySpine(spineName);
        this.addChildAt(this.spine, 2);
        this.spine.scale.set(.98);
        this.spine.y = -58;
        if (spineName == LobbySpineName.KING_MODE) {
            this.spine.scale.set(.82);
            this.spine.x = 10;
            this.spine.y = -68;
        }

        /*this.lights = new LobbyLights();
        this.addChild(this.lights);*/
    }

    onPointerOver(_?: InteractionEvent): void {
        this.setSelectorVisible(true);
    }

    /**
     * Обработчик события pointerout
     * @param e Событие взаимодейтсвия пользователя
     */
    onPointerOut(_?: InteractionEvent): void {
        this.brightness = 1;
        this.setSelectorVisible(false);
    }

    destroy() {
        this.callback = null;
        this.spine.state.timeScale = 0;

        this.selectorTween?.kill();
        this.removeChild(this.selector);
        this.removeChild(this.spine);
        this.selector.destroy();
        this.spine.destroy();
        this.selector = undefined;
        this.spine = undefined;
        this.selectorTween = undefined;

        super.destroy();
    }

    private async setSelectorVisible(value: boolean) {
        if (!this.selector) {
            return;
        }
        this.selector.interactive = false;
        value && (this.selector.visible = true);
        if (value) {
            this.selector.alpha = value ? 0 : 1;
            this.selector.visible = true;
            this.selector.y = -3;
            this.selector.scale.set(1);
            this.selector.width = this.props.bgSizes.x + 20;
            this.selector.height = this.props.bgSizes.y + 20;
            this.selector.hitArea = new Rectangle(0, 0, 0, 0);
            this.parent.setChildIndex(this, value ? 0 : 5);
            this.selector.interactive = this.selector.interactiveChildren = false;
        }
        await new Promise(resolve => this.selectorTween = TweenMax.to(this.selector, {
            alpha: value ? 1 : 0,
            duration: .3,
            width: this.props.bgSizes.x + 30,
            height: this.props.bgSizes.y + 30,
            onUpdate: () => {
                Pivot.center(this.selector);
                this.backgroundImage.scale.set(
                    1.02 + this.selectorTween.progress() * (value ? .02 : -.02),
                    1.01 + this.selectorTween.progress() * (value ? .01 : -.01)
                );
            },
            ease: Back.easeOut,
            onComplete: resolve
        }));
    }
}