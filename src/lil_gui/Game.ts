import GUI from "lil-gui";
import {ActiveData} from "../data/ActiveData";
import {CommandService} from "./CommandService";


export class Game {
    private static folder: GUI;
    private static data = {
        phase: "",
        ourScore: 0,
        theirScore: 0,
        win: () => CommandService.runCommand("winGame"),
        fail: () => CommandService.runCommand("failGame"),
        demo: () => CommandService.runCommand("demo"),
    };

    static addToGui(gui: GUI) {
        const folder = this.folder = gui.addFolder("Game");
        folder.onOpenClose((changedGUI: GUI) => Game._onOpenClose(changedGUI));
        folder.add(Game.data, "phase").disable();
        folder.add(Game.data, "ourScore", 0, 1000).onFinishChange((newScore: number) => {
            const oldScore = Game.getOurScore();
            if (oldScore >= newScore) {
                return;
            }
            CommandService.runCommand("addGameScore", [newScore - oldScore, false]);
        });
        folder.add(Game.data, "theirScore", 0, 1000).onFinishChange((newScore: number) => {
            const oldScore = Game.getTheirScore();
            if (oldScore >= newScore) {
                return;
            }
            CommandService.runCommand("addGameScore", [newScore - oldScore, true]);
        });
        folder.add(Game.data, "win");
        folder.add(Game.data, "fail");
        folder.add(Game.data, "demo");
        folder.close();
    }

    static _onOpenClose(changedGUI: GUI) {
        changedGUI._closed || this._updateUserModel();

    }

    static _updateUserModel() {
        this.data.phase = ActiveData.gameStateData?.phase || "";
        this.data.ourScore = Game.getOurScore();
        this.data.theirScore = Game.getTheirScore();
        this.folder.controllers.forEach(c => c.updateDisplay());
    }

    static getOurScore(): number {
        return 0;
        // return (DynamicData.gameState?.scoreboard?.match.myTeam ?? 0) + (DynamicData.gameState?.scoreboard?.lastRound?.myTeam.score ?? 0);
    }

    static getTheirScore(): number {
        return 0;
        // return (DynamicData.gameState?.scoreboard?.match.otherTeam ?? 0) + (DynamicData.gameState?.scoreboard?.lastRound?.otherTeam.score ?? 0);
    }
}