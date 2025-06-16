import {Point, Sprite} from "pixi.js";
import {LobbySpineName} from "../../../../../factories/spine_factory/LobbySpineName";
import {GameMode} from "../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SettingsTutorialPageFooter} from "./settings_tutorial_page/SettingsTutorialPageFooter";
import {StartTutorialButton} from "./settings_tutorial_page/StartTutorialButton";


export class SettingsTutorialPage extends Sprite {
    private buttons: StartTutorialButton[];
    private footer: SettingsTutorialPageFooter;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.buttons = [
            new StartTutorialButton(this.onStartTutorial.bind(this), "lobby/classic_mod", GameMode.CLASSIC, new Point(0, -70), LobbySpineName.CLASSIC_MODE),
            new StartTutorialButton(this.onStartTutorial.bind(this), "lobby/block_mod", GameMode.BLOCK, new Point(0, -70), LobbySpineName.BLOCK_MODE),
            new StartTutorialButton(this.onStartTutorial.bind(this), "lobby/fives_mod", GameMode.FIVES, new Point(0, -70), LobbySpineName.FIVES_MODE),
            new StartTutorialButton(this.onStartTutorial.bind(this), "lobby/king_mod", GameMode.PRO, new Point(0, -55), LobbySpineName.KING_MODE),
        ];
        this.footer = new SettingsTutorialPageFooter();
    }

    addChildren(): void {
        this.buttons.forEach(button => this.addChild(button));
        this.addChild(this.footer);
    }

    initChildren(): void {
        this.buttons.forEach((button: StartTutorialButton, i: number) => {
            button.y = 55;
            button.x = -415 + i * 275;
        });

        this.footer.y = 350;
    }

    onStartTutorial(gameMode: GameMode) {
        console.log("start tutorial --> ", gameMode);
    }

    destroy(): void {
        let button: StartTutorialButton;
        while (this.buttons.length) {
            button = this.buttons.shift();
            this.removeChild(button);
            button.destroy();
        }
        this.buttons = null;

        this.removeChild(this.footer);
        this.footer.destroy();
        this.footer = null;

        super.destroy();
    }
}
