import {Sprite, Text} from "pixi.js";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {TextFactory} from "../../../../../../factories/TextFactory";
import {SocketGameConfig} from "../../../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class RoomTarget extends Sprite {
    private icon: Sprite;
    private text: Text;

    constructor(private config: SocketGameConfig) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    destroy() {
        this.config = null;

        this.removeChild(this.icon);
        this.removeChild(this.text);

        this.icon.destroy();
        this.text.destroy();

        this.icon = undefined;
        this.text = undefined;

        super.destroy();
    }

    private createChildren() {
        this.icon = DisplayObjectFactory.createSprite("lobby/icon_final_point");
        this.text = TextFactory.createCommissioner({fontSize: 34, fontWeight: "600", value: this.config.targetScore?.toString() + " Pt", fill: 0x936746});
    }

    private addChildren() {
        this.addChild(this.icon);
        this.addChild(this.text);
    }

    private initChildren() {
        Pivot.center(this.icon);

        this.icon.x = -this.text.width / 2 - 5;
        this.text.x = this.icon.width / 2 + 5;
        this.text.y = -2;

        Pivot.center(this.text);
    }
}