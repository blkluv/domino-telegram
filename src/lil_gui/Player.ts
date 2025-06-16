import GUI, {Controller} from "lil-gui";
import {InputPopupData} from "../domino_game/root/popups_container/input_popup/InputPopupData";
import {DynamicData} from "../DynamicData";
import {GameEvents} from "../GameEvents";
import {CommandService} from "./CommandService";


export class Player {
    private static folder: GUI;
    private static expController: Controller;
    private static data = {
        changeRole: Player.changeRole,
        exp: 0,
        money: 0
    };

    static async changeRole(): Promise<void> {
        let password: string = await new Promise<string>((resolve, _reject) => {
            let data: InputPopupData = {
                resolve,
                titleText: "Enter Password",
                yesText: "OK",
                placeholderText: "password..."
            };
            dispatchEvent(new MessageEvent(GameEvents.OPEN_INPUT_POPUP, {data}));
        });
        CommandService.runCommand("changeRole", "test", password);
    }

    static addToGui(gui: GUI) {
        const folder = this.folder = gui.addFolder("Player");
        folder.onOpenClose(changedGUI => Player._onOpenClose(changedGUI));
        folder.add(Player.data, "changeRole");
        Player.expController = folder.add(Player.data, "exp", 0, 99, 0.1).onFinishChange(() => Player._saveExp());
        folder.add(Player.data, "money", 0, 1000000000, 10).onFinishChange(() => Player._saveMoney());
        folder.close();
    }

    static _onOpenClose(changedGUI: GUI) {
        changedGUI._closed || this._updateData();
    }

    static _updateData() {

        this.data.exp = DynamicData.myProfile.level + DynamicData.myProfile.nextLevelProgress;
        this.data.money = DynamicData.myProfile.coins;

        // Пока уменьшение опыта не поддерживается
        this.expController.min(this.data.exp);

        this.folder.controllers.forEach(c => c.updateDisplay());
    }

    static _saveExp() {
        const old = DynamicData.myProfile.level + DynamicData.myProfile.nextLevelProgress;
        if (this.data.exp > old) {
            CommandService.runCommand("addExp", this.data.exp - old);
        }
    }

    static _saveMoney() {
        const old = DynamicData.myProfile.coins;
        if (this.data.money != old) {
            CommandService.runCommand("addCoins", this.data.money - old);
        }
    }
}