import {NineSlicePlane, Sprite, Text} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework"
import {TextFactory} from "../../../../../factories/TextFactory";
import {GameMode} from "../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {StaticData} from "../../../../../StaticData";


import {Pivot} from "@azur-games/pixi-vip-framework"

export class Bet extends Sprite {
    back: NineSlicePlane;
    backLeft: Sprite;
    backRight: Sprite;
    text: Text;

    constructor() {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    destroy() {
        super.destroy();
    }

    private createChildren() {
        let gameConfig = StaticData.getCurrentGameConfig();
        this.text = TextFactory.createCommissioner({
            value: (gameConfig.gameMode == GameMode.PRO ? gameConfig.bet : gameConfig.cost).toString(),
            fill: 0x32b896,
            fontSize: 55
        });

        this.backLeft = DisplayObjectFactory.createSprite("table/default/back_bet_line");
        this.backRight = DisplayObjectFactory.createSprite("table/default/back_bet_line");
        this.back = DisplayObjectFactory.createNineSlicePlane("table/default/back_bet_bg", 40);
    }

    private addChildren() {
        this.addChild(this.backLeft);
        this.addChild(this.backRight);
        this.addChild(this.back);
        this.addChild(this.text);
    }

    private initChildren() {
        this.back.width = 300;

        Pivot.center(this.back);
        this.backLeft.anchor.set(1, .5);
        this.backRight.anchor.set(1, .5);
        Pivot.center(this.text);

        this.backRight.scale.x = -1;

        this.backLeft.x = -150;
        this.backRight.x = 150;
        this.text.y = -4;
    }
}