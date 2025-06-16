import {Spine} from "pixi-spine";
import {Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {SpineFactory} from "../../../../../../factories/SpineFactory";
import {GameEvents} from "../../../../../../GameEvents";
import {SmileConfig} from "@azur-games/pixi-vip-framework";
import {SocketService} from "../../../../../../services/SocketService";


export class TableChatSmile extends Button {
    private spine: Spine;

    constructor(private config: SmileConfig) {
        super({
            bgTextureName: "table/chat/smile_bg",
            bgCornersSize: [55, 42, 55, 55],
            bgSizes: new Point(168, 154)
        });

        this.spine = SpineFactory.createCat(config.animation);
        this.addChild(this.spine);
        this.spine.scale.set(.7);
        this.spine.x = 10;
        this.spine.y = 5;
    }

    processClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_TABLE_CHAT));
        SocketService.sendChatSmileMessage(this.config.chatMessage);
        this.brightness = .8;
    }

    onPointerDown(): void {
        this.changeBackgroundImage("table/chat/smile_bg_blue");
    }

    onPointerUp(): void {
        this.changeBackgroundImage("table/chat/smile_bg");
    }

    destroy(): void {
        this.removeChild(this.spine);
        this.spine.destroy();
        this.spine = null;
        super.destroy();
    }
}
