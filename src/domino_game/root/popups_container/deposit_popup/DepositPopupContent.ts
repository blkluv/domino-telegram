import {Button, DisplayObjectFactory, Pivot, PreloaderService, StageResizeListening, TonRates} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane} from "pixi.js";
import {DominoGame} from "../../../../app";
import {DepositCurrencyChosen} from "../../../../game_events/DepositCurrencyChosen";
import {GameEvents} from "../../../../GameEvents";
import {SocketService} from "../../../../services/SocketService";
import {CurrencyName, CurrencyNameValues} from "./deposit_popup_content/currency_selection_page/CurrencyName";
import {DepositCurrencyPage} from "./deposit_popup_content/DepositCurrencyPage";
import {DepositCurrencySelectionPage} from "./deposit_popup_content/DepositCurrencySelectionPage";
import {DepositPageType} from "./deposit_popup_content/DepositPageType";


export class DepositPopupContent extends StageResizeListening {
    private rates: TonRates;
    private background: NineSlicePlane;
    private backButton: Button;
    private currencySelectionPage: DepositCurrencySelectionPage;
    private currencyPage: DepositCurrencyPage;
    private currentPage: DepositPageType = DepositPageType.SELECTION;
    private onCurrencyChosenBindThis: (e: DepositCurrencyChosen) => void;

    constructor() {
        super();
        this.init();

        this.onCurrencyChosenBindThis = this.onCurrencyChosen.bind(this);
        addEventListener(GameEvents.DEPOSIT_CURRENCY_CHOSEN, this.onCurrencyChosenBindThis);
    }

    async init() {
        let id = PreloaderService.show();
        this.rates = await SocketService.tonRates();
        PreloaderService.hide(id);
        this.createChildren();
        this.addChildren();
        this.onGameScaleChanged();
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("lobby/lobby_bg", 1, 1, 1, 1);
        this.backButton = new Button({
            callback: this.onBackButtonClick.bind(this),
            iconTextureName: "deposit/right_arrow_icon"
        });
        this.currencySelectionPage = new DepositCurrencySelectionPage(this.rates);
        this.currencyPage = new DepositCurrencyPage();
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.backButton);
        this.addChild(this.currencySelectionPage);
        this.addChild(this.currencyPage).visible = false;
    }

    onCurrencyChosen(e: DepositCurrencyChosen) {
        const name: CurrencyNameValues = e.detail.name;
        this.currencyPage.visible = name !== CurrencyName.NONE;
        this.currencySelectionPage.visible = name === CurrencyName.NONE;
        this.currentPage = name == CurrencyName.NONE ? DepositPageType.SELECTION : DepositPageType.CURRENCY;
        name === CurrencyName.NONE || this.currencyPage.applyData(name, this.rates);

    }

    onBackButtonClick() {
        if (this.currentPage == DepositPageType.SELECTION) {
            dispatchEvent(new MessageEvent(GameEvents.CLOSE_DEPOSIT_POPUP));
        } else {
            dispatchEvent(new DepositCurrencyChosen({name: CurrencyName.NONE}));
        }
    }

    onGameScaleChanged() {
        this.background.width = DominoGame.instance.screenW;
        this.background.height = DominoGame.instance.screenH;

        this.backButton.icon.rotation = Math.PI;

        Pivot.center(this.backButton.icon);
        Pivot.center(this.background);

        this.backButton.x = -DominoGame.instance.screenW / 2 + 96;
        this.backButton.y = -DominoGame.instance.screenH / 2 + 96;
        this.currencySelectionPage.y = -DominoGame.instance.screenH / 2;
        this.currencyPage.y = -DominoGame.instance.screenH / 2;
        this.currencyPage.initChildren();
        this.currencySelectionPage.initChildren();

    }

    destroy() {
        removeEventListener(GameEvents.DEPOSIT_CURRENCY_CHOSEN, this.onCurrencyChosenBindThis);
        this.onCurrencyChosenBindThis = null;

        this.removeChild(this.background);
        this.removeChild(this.backButton);
        this.removeChild(this.currencyPage);
        this.removeChild(this.currencySelectionPage);

        this.background.destroy();
        this.backButton.destroy();
        this.currencyPage.destroy();
        this.currencySelectionPage.destroy();

        this.background = null;
        this.backButton = null;
        this.currencyPage = null;
        this.currencySelectionPage = null;
        this.currentPage = null;
        this.rates = null;

        super.destroy();
    }
}