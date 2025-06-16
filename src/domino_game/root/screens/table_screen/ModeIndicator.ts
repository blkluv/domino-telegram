import {NineSlicePlane, Sprite, Text} from "pixi.js";
import {DominoGame} from "../../../../app";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {StageResizeListening} from "@azur-games/pixi-vip-framework";
import {GameStateData} from "../../../../data/active_data/GameStateData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../factories/TextFactory";
import {GameMode} from "../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {BetBlock} from "./mode_indicator/BetBlock";
import {PointsBlock} from "./mode_indicator/PointsBlock";
import {RoundBlock} from "./mode_indicator/RoundBlock";


export class ModeIndicator extends StageResizeListening {
    private back: Sprite;
    private bgBig: Sprite;
    private bgSmall: NineSlicePlane;
    private dominoText: Text;
    private modeText: LanguageText;
    private anteText: LanguageText;
    private betBlock: BetBlock;
    private pointsBlock: PointsBlock;
    private roundBlock: RoundBlock;

    constructor(private mode: GameMode) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.onGameScaleChanged();
    }

    destroy() {
        this.removeChild(this.back);
        this.removeChild(this.bgBig);
        this.removeChild(this.bgSmall);
        this.removeChild(this.dominoText);
        this.removeChild(this.modeText);
        this.removeChild(this.betBlock);
        this.removeChild(this.pointsBlock);
        this.removeChild(this.roundBlock);
        this.removeChild(this.anteText);

        this.back.destroy();
        this.bgBig.destroy();
        this.bgSmall.destroy();
        this.dominoText.destroy();
        this.modeText.destroy();
        this.betBlock.destroy();
        this.pointsBlock.destroy();
        this.roundBlock.destroy();
        this.anteText.destroy();

        this.back = undefined;
        this.bgBig = undefined;
        this.bgSmall = undefined;
        this.dominoText = undefined;
        this.modeText = undefined;
        this.betBlock = undefined;
        this.pointsBlock = undefined;
        this.roundBlock = undefined;
        this.anteText = undefined;

        super.destroy();
    }

    setGameStateData(gameStateData: GameStateData) {
        this.roundBlock.setGameStateData(gameStateData);
    }

    private createChildren() {
        this.back = DisplayObjectFactory.createSprite("table/mode_indicator/bg_gradient");
        this.bgBig = DisplayObjectFactory.createSprite("table/mode_indicator/bg_big");
        this.bgSmall = DisplayObjectFactory.createNineSlicePlane("table/mode_indicator/bg_small", 56, 56, 56, 68);
        this.dominoText = TextFactory.createCommissioner({
            value: "DOMINO",
            fontSize: 44,
        });
        this.modeText = new LanguageText({
            key: "Lobby/GameMode/" + this.mode.toUpperCase(),
            fontSize: 27,
            fill: 0xfcd520
        });
        this.betBlock = new BetBlock();
        this.pointsBlock = new PointsBlock();
        this.roundBlock = new RoundBlock();
        this.anteText = new LanguageText({key: "Lobby/Ante", fontSize: 18, fill: 0x623895, centerAfterLanguageChanged: true});
    }

    private addChildren() {
        this.addChild(this.back);
        this.addChild(this.bgBig);
        this.addChild(this.bgSmall);
        this.addChild(this.dominoText);
        this.addChild(this.modeText);
        this.addChild(this.betBlock);
        this.addChild(this.pointsBlock);
        this.addChild(this.roundBlock);
        this.addChild(this.anteText);
    }

    onGameScaleChanged(e?: MessageEvent): void {
        this.x = -DominoGame.instance.screenW / 2;
        this.y = -DominoGame.instance.screenH / 2;
    }

    private initChildren() {
        this.bgBig.x = 40;
        this.bgBig.y = 70;

        this.bgSmall.x = 40;
        this.bgSmall.y = 70;
        this.bgSmall.width = 250;

        this.dominoText.x = 60;
        this.dominoText.y = 11;
        this.dominoText.style.letterSpacing = 4;
        this.dominoText.style.stroke = 0x292929;
        this.dominoText.style.strokeThickness = 3;

        this.modeText.x = 290;
        this.modeText.y = 26;
        this.modeText.style.letterSpacing = 2;
        this.modeText.style.stroke = 0x292929;
        this.modeText.style.strokeThickness = 3;

        this.pointsBlock.x = 370;
        this.pointsBlock.y = 125;

        this.roundBlock.x = 550;
        this.roundBlock.y = 125;
        this.anteText.x = 168;
        this.anteText.y = 150;

        if (this.mode == GameMode.PRO) {
            this.pointsBlock.visible = false;
            this.roundBlock.visible = false;
            this.bgBig.visible = false;
            this.betBlock.x = 168;
            this.betBlock.y = 115;
        } else {
            this.anteText.visible = false;
            this.bgSmall.visible = false;
            this.betBlock.x = 145;
            this.betBlock.y = 125;
        }
    }

    reset() {
        this.roundBlock.reset();
    }
}