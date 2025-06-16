import {Sprite, Text} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../../factories/TextFactory";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {StatByGame} from "../../../../../../services/socket_service/socket_message_data/profile_data/stats/StatByGame";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {DiagramType} from "./diagram/DiagramType";


export class DiagramPointsItem extends Sprite {
    private background: Sprite;
    private titleText: LanguageText;
    private pointsText: Text;
    private stat: StatByGame;

    constructor(private titleTextKey: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("profile/chart_point_frame_white");
        this.titleText = new LanguageText({key: this.titleTextKey, fill: 0x7B7872, fontSize: 30});
        this.pointsText = TextFactory.createCommissioner({value: "", fontSize: 22, fill: 0});
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.titleText);
        this.addChild(this.pointsText).alpha = .8;
    }

    initChildren(): void {
        Pivot.center(this.background);
        this.pointsText.alpha = .5;
        this.titleText.anchor.set(.5, 1);
        this.titleText.y = -25;
    }

    update(stat: StatByGame, type: DiagramType): void {
        this.stat = stat;
        type == DiagramType.GAMES_PLAYED ? this.gamesPlayedUpdate() : this.winRateUpdate();
    }

    gamesPlayedUpdate() {
        this.pointsText.text = this.stat.gameCount;
        this.background.texture = LoaderService.getTexture("profile/chart_point_frame_white");
        Pivot.center(this.pointsText);
    }

    winRateUpdate(): void {
        if (!this.stat.gameCount) {
            this.pointsText.text = "-";
            this.background.texture = LoaderService.getTexture("profile/chart_point_frame_white");
            Pivot.center(this.pointsText);
            return;
        }
        let winRate: number = Math.trunc(this.stat.wonGameCount / this.stat.gameCount * 100);
        this.pointsText.text = winRate + "%";

        if (winRate < 21) {
            this.background.texture = LoaderService.getTexture("profile/chart_point_frame_red");
        } else if (winRate > 50) {
            this.background.texture = LoaderService.getTexture("profile/chart_point_frame_green");
        } else {
            this.background.texture = LoaderService.getTexture("profile/chart_point_frame_yellow");
        }

        Pivot.center(this.pointsText);
        Pivot.center(this.background);
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.titleText);
        this.removeChild(this.pointsText);

        this.background.destroy();
        this.titleText.destroy();
        this.pointsText.destroy();

        this.background = null;
        this.titleText = null;
        this.pointsText = null;

        super.destroy();
    }
}
