import {SmilesService} from "@azur-games/pixi-vip-framework";
import {TableChatSmile} from "./table_chat_smiles/TableChatSmile";
import {TableChatPanel} from "./TableChatPanel";


export class TableChatSmiles extends TableChatPanel {
    protected items: TableChatSmile[];

    constructor() {
        super();
        this.createSmiles();
    }

    createSmiles() {
        this.items = SmilesService.getSmilePackConfigByIndex("5").smiles.map((config, i) => {
            let smile: TableChatSmile = new TableChatSmile(config);
            this.addChild(smile);
            let columns: number = 2;
            smile.x = (i % columns) * 190 - 100;
            smile.y = Math.floor(i / columns) * 190 + 200;
            return smile;
        });
    }

    destroy(): void {
        let smile: TableChatSmile;
        while (this.items.length) {
            smile = this.items.shift();
            this.removeChild(smile);
            smile.destroy();
            smile = null;
        }
        this.items = null;
        super.destroy();
    }
}
