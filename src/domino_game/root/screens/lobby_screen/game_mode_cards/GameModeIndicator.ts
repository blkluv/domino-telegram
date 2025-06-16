import {NineSlicePlane, Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextCaseFormat} from "@azur-games/pixi-vip-framework";
import {GameMode} from "../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class GameModeIndicator extends Sprite {
    private backLeft: NineSlicePlane;
    private backRight: NineSlicePlane;
    private leftText: LanguageText;
    private rightText: LanguageText;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.pivot.y = 4;
    }

    destroy() {
        this.removeChild(this.backLeft);
        this.removeChild(this.backRight);
        this.removeChild(this.leftText);
        this.removeChild(this.rightText);

        this.backLeft.destroy();
        this.backRight.destroy();
        this.leftText.destroy();
        this.rightText.destroy();

        this.backLeft = undefined;
        this.backRight = undefined;
        this.leftText = undefined;
        this.rightText = undefined;

        super.destroy();
    }

    setData(gameMode: GameMode, page: number): void {
        this.leftText.changeText("Lobby/GameMode/" + gameMode.toUpperCase());
        this.leftText.y = this.leftText.height > 50 ? 0 : -2;
        this.rightText.changeText(page == 0 ? "menu.title.beginner" : "menu.title.advanced");
    }

    private createChildren() {
        this.backLeft = DisplayObjectFactory.createNineSlicePlane("lobby/plate_name_mod", 1, 36, 60, 36);
        this.backRight = DisplayObjectFactory.createNineSlicePlane("lobby/plate_name_mod", 1, 36, 60, 36);
        this.leftText = new LanguageText({key: "", fontSize: 36, autoFitWidth: 160, placeholders: [":"]});
        this.rightText = new LanguageText({key: "", fontSize: 40, autoFitWidth: 250, textFormat: TextCaseFormat.UPPERCASE});
    }

    private addChildren() {
        this.addChild(this.backLeft);
        this.addChild(this.backRight);
        this.addChild(this.leftText).y = -2;
        this.addChild(this.rightText).y = -3;
    }

    private initChildren() {
        this.backLeft.alpha = .5;
        this.backLeft.width = 200;
        this.backRight.width = 300;
        Pivot.center(this.backLeft);
        Pivot.center(this.backRight);
        this.backLeft.scale.x = -this.backLeft.scale.x;

        this.backLeft.x = -this.backRight.width / 2;
        this.backRight.x = this.backLeft.width / 2;

        this.leftText.x = this.backLeft.x + 5;
        this.rightText.x = this.backRight.x;

        this.leftText.style.stroke = 0x333333;
        this.leftText.style.strokeThickness = 4;
        this.rightText.style.stroke = 0x333333;
        this.rightText.style.strokeThickness = 4;
    }
}
