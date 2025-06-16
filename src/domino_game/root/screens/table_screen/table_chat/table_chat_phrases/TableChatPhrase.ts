import {Point} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../GameEvents";
import {SocketService} from "../../../../../../services/SocketService";


export class TableChatPhrase extends Button {
    constructor(private textKey: string) {
        super({
            textKey: "text-chat.button." + textKey,
            bgTextureName: "table/chat/phrase_bg",
            bgCornersSize: [60, 60, 60, 72],
            bgSizes: new Point(390, 133),
            fontSize: 46,
            fontColor: 0x025373,
            textPosition: new Point(0, -15),
            withCooldown: true,
            autoFitWidth: 300
        });
    }

    processClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_TABLE_CHAT));
        SocketService.sendChatTextMessage(this.textKey);
        this.brightness = .8;
    }

    onPointerDown(): void {
        this.changeBackgroundImage("table/chat/phrase_bg_white");
    }

    onPointerUp(): void {
        this.changeBackgroundImage("table/chat/phrase_bg");
    }
}
