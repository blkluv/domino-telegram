import {Sprite} from "pixi.js";
import {Reason} from "../../../../../dynamic_data/SocketGameRequest";
import {SocketGameRequestState} from "../../../../../dynamic_data/SocketGameRequestState";
import {DynamicData} from "../../../../../DynamicData";
import {EndGameScoreText, TextAlign} from "./end_game_score/EndGameScoreText";


export class EndGameScore extends Sprite {
    private colonText: EndGameScoreText;
    private myScoreText: EndGameScoreText;
    private theirsScoreText: EndGameScoreText;
    myWin: boolean;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    destroy() {
        this.removeChild(this.colonText);
        this.removeChild(this.myScoreText);
        this.removeChild(this.theirsScoreText);

        this.colonText.destroy();
        this.myScoreText.destroy();
        this.theirsScoreText.destroy();

        this.colonText = undefined;
        this.myScoreText = undefined;
        this.theirsScoreText = undefined;

        super.destroy();
    }

    private createChildren() {
        this.colonText = new EndGameScoreText(TextAlign.CENTER);
        this.myScoreText = new EndGameScoreText(TextAlign.RIGHT);
        this.theirsScoreText = new EndGameScoreText(TextAlign.LEFT);
    }

    private addChildren() {
        this.addChild(this.colonText);
        this.addChild(this.myScoreText);
        this.addChild(this.theirsScoreText);
    }

    private initChildren() {
        this.colonText.setValue(":");
        let myRoundsWon: number = DynamicData.socketGameRequest.roundsWon ?? 0;
        let theirsRoundsWon: number = DynamicData.socketGameRequest.rounds - myRoundsWon;
        this.myScoreText.setValue(myRoundsWon.toString());
        this.theirsScoreText.setValue(theirsRoundsWon.toString());

        this.myScoreText.x = -this.myScoreText.text.width / 2 - 30;
        this.theirsScoreText.x = this.theirsScoreText.text.width / 2 + 30;
        let req = DynamicData.socketGameRequest;
        let myWin: boolean = myRoundsWon > theirsRoundsWon;
        switch (req.reason) {
            case Reason.EXIT:
                myWin = req.state == SocketGameRequestState.WON;
                break;
        }
        this.myWin = myWin;
    }
}