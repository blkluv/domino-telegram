import {NineSlicePlane} from "pixi.js";
import {DisplayObjectFactory, LanguageText, StageResizeListening} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {DominoGame} from "../../../../app";
import {CurrencySelectionStage} from "./CurrencySelectionStage";
import {DepositSteps} from "./components/DepositSteps";


export class DepositPopupContent extends StageResizeListening {
    private background: NineSlicePlane;
    private title: LanguageText;
    private stepIndicator: DepositSteps;
    private currencySelectionStage: CurrencySelectionStage;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.onGameScaleChanged();
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("lobby/lobby_bg", 1, 1, 1, 1);
        this.title = new LanguageText({key: "Deposit", fontSize: 56, fontWeight: "500", fill: 0xF1F3FF});
        this.stepIndicator = new DepositSteps();
        this.currencySelectionStage = new CurrencySelectionStage();
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.title);
        this.addChild(this.stepIndicator);
        this.addChild(this.currencySelectionStage);
    }

    initChildren() {
    }

    onGameScaleChanged() {
        this.background.width = DominoGame.instance.screenW;
        this.background.height = DominoGame.instance.screenH;

        Pivot.center(this.background);
        Pivot.center(this.title);

        this.title.y = -DominoGame.instance.screenH / 2 + 89;
        this.stepIndicator.y = -DominoGame.instance.screenH / 2 + 400;
        this.currencySelectionStage.y = -DominoGame.instance.screenH / 2 + 650;
    }

    destroy() {
        this.removeChild(this.background);
        this.removeChild(this.title);
        this.removeChild(this.stepIndicator);
        this.removeChild(this.currencySelectionStage);

        this.background.destroy();
        this.title.destroy();
        this.stepIndicator.destroy();
        this.currencySelectionStage.destroy();

        this.background = null;
        this.title = null;
        this.stepIndicator = null;
        this.currencySelectionStage = null;

        super.destroy();
    }
}