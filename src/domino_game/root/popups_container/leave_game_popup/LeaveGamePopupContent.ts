import {Point, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {SocketService} from "../../../../services/SocketService";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {PopupBody} from "../PopupBody";
import {LoseBlock} from "./leave_game_popup/LoseBlock";


export class LeaveGamePopupContent extends Sprite {
    private body: PopupBody;
    private sureText: LanguageText;
    private loseBlock: LoseBlock;
    private leaveButton: Button;
    private stayButton: Button;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.body = new PopupBody(this.onClose.bind(this), "QuitWindow/title");
        this.sureText = new LanguageText({key: "QuitWindow/are-you-sure", fontSize: 40, fill: 0x9E7D5F});
        this.loseBlock = new LoseBlock();
        this.leaveButton = new Button({
            callback: this.onLeave.bind(this),
            textKey: "QuitWindow/ok",
            bgTextureName: "common/ButtonRed",
            bgCornersSize: 52,
            bgSizes: new Point(430, 80),
            fontSize: 32,
            textPosition: new Point(0, -1),
            autoFitWidth: 250
        });
        this.stayButton = new Button({
            callback: this.onStay.bind(this),
            textKey: "QuitWindow/cancel",
            bgTextureName: "common/ButtonGreen",
            bgCornersSize: 52,
            bgSizes: new Point(430, 87),
            fontSize: 32,
            textPosition: new Point(0, -1),
            autoFitWidth: 250
        });
    }

    async onLeave(): Promise<void> {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_MENU_AND_BAZAR));
        await SocketService.leaveGame(true);
        this.onStay();
    }

    onStay(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_LEAVE_GAME_POPUP));
    }

    addChildren(): void {
        this.addChild(this.body);
        this.addChild(this.sureText);
        this.addChild(this.loseBlock);
        this.addChild(this.leaveButton);
        this.addChild(this.stayButton);
    }

    initChildren(): void {
        Pivot.center(this.sureText);
        this.sureText.y = -130;
        this.loseBlock.y = 60;
        this.leaveButton.y = this.stayButton.y = 270;
        this.leaveButton.x = -280;
        this.stayButton.x = 280;
    }

    onClose(): void {
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_LEAVE_GAME_POPUP));
    }

    destroy(): void {
        this.removeChild(this.body);
        this.removeChild(this.sureText);
        this.removeChild(this.loseBlock);
        this.removeChild(this.leaveButton);
        this.removeChild(this.stayButton);

        this.body.destroy();
        this.sureText.destroy();
        this.loseBlock.destroy();
        this.leaveButton.destroy();
        this.stayButton.destroy();

        this.body = null;
        this.sureText = null;
        this.loseBlock = null;
        this.leaveButton = null;
        this.stayButton = null;

        super.destroy();
    }
}
