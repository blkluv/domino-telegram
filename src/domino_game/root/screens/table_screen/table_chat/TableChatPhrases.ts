import {TableChatPhrase} from "./table_chat_phrases/TableChatPhrase";
import {TableChatPanel} from "./TableChatPanel";


export class TableChatPhrases extends TableChatPanel {
    protected items: TableChatPhrase[];

    constructor() {
        super();
        this.createPhrases();
    }

    createPhrases(): void {
        this.items = ["hi", "nice", "thx", "cu", "u2", "sry"].map((textKey, i) => {
            let phrase: TableChatPhrase = new TableChatPhrase(textKey);
            this.addChild(phrase);
            phrase.y = i * 150 + 220;
            return phrase;
        });
    }

    destroy(): void {
        let phrase: TableChatPhrase;
        while (this.items.length) {
            phrase = this.items.shift();
            this.removeChild(phrase);
            phrase.destroy();
            phrase = null;
        }
        this.items = null;
        super.destroy();
    }
}
