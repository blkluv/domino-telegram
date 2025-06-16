import {Spine} from "pixi-spine";
import {InteractionEvent, Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LobbySpineName} from "../../../../../../factories/spine_factory/LobbySpineName";
import {SpineFactory} from "../../../../../../factories/SpineFactory";
import {GameMode} from "../../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";


export class StartTutorialButton extends Button {
    private spine: Spine;

    constructor(private callback: Function, iconTextureName: string, private gameMode: GameMode, private iconPosition: Point = new Point(0, -70), private spineName: LobbySpineName) {
        super({
            bgTextureName: "lobby/cards_gold",
            bgCornersSize: [75, 75, 75, 100],
            bgSizes: new Point(370, 660),
            iconTextureName,
            iconPosition,
            textKey: "Lobby/GameMode/" + gameMode.toUpperCase(),
            fontSize: 42,
            fontColor: 0x926746,
            textPosition: new Point(0, 210),
            autoFitWidth: 290,
        });
        this.scale.set(.7);
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    processClick(_e: InteractionEvent) {
        this.callback(this.gameMode);
    };

    createChildren(): void {
        this.spine = SpineFactory.createLobbySpine(this.spineName);
    }

    addChildren(): void {
        this.addChild(this.spine);
    }

    initChildren(): void {
        this.spine.scale.set(.97, 1);
        this.spineName == LobbySpineName.KING_MODE && (this.spine.scale.set(.87));
        this.spine.y = this.iconPosition.y - 5;
    }

    destroy(): void {
        this.spine.state.timeScale = 0;
        this.removeChild(this.spine);
        this.spine.destroy();
        this.spine = null;

        super.destroy();
    }
}
