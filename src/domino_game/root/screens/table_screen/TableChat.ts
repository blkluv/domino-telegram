import {DominoGame} from "../../../../app";
import {Button} from "@azur-games/pixi-vip-framework";
import {ScreenCovering} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {TableChatPhrases} from "./table_chat/TableChatPhrases";
import {TableChatSmiles} from "./table_chat/TableChatSmiles";


export class TableChat extends ScreenCovering {
    private smilesButton: Button;
    private phrasesButton: Button;
    private phrasesPanel: TableChatPhrases;
    private smilesPanel: TableChatSmiles;
    private onCloseBindThis: (e: MessageEvent) => void;

    constructor() {
        super(.4, true);
        this.createChildren();
        this.addChildren();
        this.onGameScaleChanged();
        this.onCloseBindThis = this.onClose.bind(this);
        addEventListener(GameEvents.CLOSE_TABLE_CHAT, this.onCloseBindThis);
        this.enableOverlay(false);
        this.enableButtons(false);
    }

    createChildren(): void {
        this.smilesButton = new Button({
            callback: this.onSmilesButtonClick.bind(this),
            bgTextureName: "lobby/circle_plate_menu",
            iconTextureName: "table/chat/icon_smiley_table",
            disabledOffline: true,
            dimWhenDisabled: true
        });
        this.phrasesButton = new Button({
            callback: this.onPhrasesButtonClick.bind(this),
            bgTextureName: "lobby/circle_plate_menu",
            iconTextureName: "lobby/icon_message",
            disabledOffline: true,
            dimWhenDisabled: true
        });
        this.phrasesPanel = new TableChatPhrases();
        this.smilesPanel = new TableChatSmiles();
    }

    addChildren(): void {
        this.addChild(this.smilesButton);
        this.addChild(this.phrasesButton);
        this.addChild(this.phrasesPanel);
        this.addChild(this.smilesPanel);
    }

    onGameScaleChanged(): void {
        super.onGameScaleChanged();
        if (!this.smilesButton) {
            return;
        }
        this.smilesButton.x = DominoGame.instance.screenW / 2 - 300;
        this.smilesButton.y = DominoGame.instance.screenH / 2 - 100;
        this.phrasesButton.x = DominoGame.instance.screenW / 2 - 150;
        this.phrasesButton.y = DominoGame.instance.screenH / 2 - 200;
        this.phrasesPanel.resize();
        this.smilesPanel.resize();
    }

    onOverlayClick() {
        this.onClose();
    }

    onSmilesButtonClick(): void {
        this.smilesPanel.show(true);
        this.enableOverlay(true);
    }

    onPhrasesButtonClick(): void {
        this.phrasesPanel.show(true);
        this.enableOverlay(true);
    }

    onClose(): void {
        this.phrasesPanel.show(false);
        this.smilesPanel.show(false);
        this.enableOverlay(false);
    }

    enableButtons(value: boolean): void {
        this.phrasesButton.enabled = value;
        this.smilesButton.enabled = value;
        this.phrasesButton.brightness = value ? 1 : 0.8;
        this.smilesButton.brightness = value ? 1 : 0.8;
    }

    destroy(): void {
        removeEventListener(GameEvents.CLOSE_TABLE_CHAT, this.onCloseBindThis);
        this.onCloseBindThis = null;

        this.removeChild(this.smilesButton);
        this.removeChild(this.phrasesButton);
        this.removeChild(this.phrasesPanel);
        this.removeChild(this.smilesPanel);

        this.smilesButton.destroy();
        this.phrasesButton.destroy();
        this.phrasesPanel.destroy();
        this.smilesPanel.destroy();

        this.smilesButton = null;
        this.phrasesButton = null;
        this.phrasesPanel = null;
        this.smilesPanel = null;
        super.destroy();
    }
}
