import {CurrencyNameValues} from "../domino_game/root/popups_container/deposit_popup/deposit_popup_content/currency_selection_page/CurrencyName";
import {GameEvents} from "../GameEvents";


export type DepositCurrencyChosenPayload = {
    name: CurrencyNameValues;
}

export class DepositCurrencyChosen extends CustomEvent<DepositCurrencyChosenPayload> {
    constructor(detail: DepositCurrencyChosenPayload) {
        super(GameEvents.DEPOSIT_CURRENCY_CHOSEN, {detail});
    }
}