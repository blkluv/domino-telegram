import {NineSlicePlane, Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {SocketGameConfig} from "../../../../../../services/socket_service/socket_message_data/SocketGameConfig";
import {NumberUtils} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {UnderlayCoin} from "../../../../popups_container/store_popup/store_popup_content/store_container/store_items/store_item/coins_amount/UnderlayCoin";


export class RoomHeader extends Sprite {
    private background: NineSlicePlane;
    private headerText: LanguageText;
    private iconCoin: UnderlayCoin;
    private priceText: LanguageText;
    private endless: boolean;

    constructor(private config: SocketGameConfig) {
        super();
        this.endless = this.config.gameType.includes("endless");
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    private createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("lobby/cards_room_top", 28, 28, 28, 28);
        this.headerText = new LanguageText({
            key: this.endless ? "Lobby/EntranceBalance" : "Lobby/Win",
            fontSize: this.endless ? 20 : 16,
            fill: "0xFDF3D5",
        });
        this.iconCoin = new UnderlayCoin();
        this.priceText = new LanguageText({key: this.createPrice(), fontSize: 38, autoFitWidth: 170});
    }

    private addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.headerText);
        this.addChild(this.iconCoin);
        this.addChild(this.priceText);
    }

    private initChildren(): void {
        this.background.width = this.endless ? 242 : 220;
        this.background.height = this.endless ? 84 : 70;

        this.priceText.setTextStroke(0x935438, 4);

        Pivot.center(this.background);
        Pivot.center(this.headerText);
        Pivot.center(this.priceText);
        Pivot.center(this.iconCoin);

        this.headerText.y = this.endless ? -22 : -20;

        this.iconCoin.x = -this.priceText.width / 2 - 3;
        this.priceText.x = this.iconCoin.backgroundWidth / 2 + 3;

        this.iconCoin.y = this.endless ? 14 : 10;
        this.priceText.y = this.iconCoin.y - 2;
    }

    createPrice(): string {
        let balance: string = NumberUtils.coinsKiloFormat(this.config.minBalanceCoins) + (this.config.maxBalanceCoins ? "~" + NumberUtils.coinsKiloFormat(this.config.maxBalanceCoins) : "+");
        let reward: string = NumberUtils.coinsKiloFormat(this.config.reward);
        return this.endless ? balance : reward;
    }

    destroy(): void {
        this.config = null;

        this.removeChild(this.background);
        this.removeChild(this.headerText);
        this.removeChild(this.iconCoin);
        this.removeChild(this.priceText);

        this.background.destroy();
        this.headerText.destroy();
        this.iconCoin.destroy();
        this.priceText.destroy();

        this.background = undefined;
        this.headerText = undefined;
        this.iconCoin = undefined;
        this.priceText = undefined;

        super.destroy();
    }
}