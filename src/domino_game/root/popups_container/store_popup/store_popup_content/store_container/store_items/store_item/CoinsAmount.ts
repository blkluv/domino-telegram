import {Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {ProductData} from "../../../../../../../../services/socket_service/socket_message_data/ProductData";
import {NumberUtils} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {UnderlayCoin} from "./coins_amount/UnderlayCoin";


export class CoinsAmount extends Sprite {
    private coin: UnderlayCoin;
    private coinsAmountText: LanguageText;

    constructor(private productData: ProductData) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.coin = new UnderlayCoin();
        this.coinsAmountText = new LanguageText({
            key: NumberUtils.coinsKiloFormat(this.productData.goodsInstant.coin),
            fontSize: 42,
            fill: 0x905E4B
        });
    }

    addChildren(): void {
        this.addChild(this.coin);
        this.addChild(this.coinsAmountText);
    }

    initChildren(): void {
        this.coinsAmountText.setTextStroke(0xffffff, 4, false);

        Pivot.center(this.coinsAmountText, false, true);

        this.coin.x = 33;
        this.coinsAmountText.x = this.coin.backgroundWidth + 20;
        this.coinsAmountText.y = -2;

        this.x = -(this.coinsAmountText.width + this.coinsAmountText.x) / 2;
    }

    get coinIconOffsetX(): number {
        return this.x + this.coin.x;
    }

    destroy(): void {
        this.removeChild(this.coin);
        this.removeChild(this.coinsAmountText);

        this.coin.destroy();
        this.coinsAmountText.destroy();

        this.coin = null;
        this.coinsAmountText = null;
        this.productData = null;

        super.destroy();
    }
}
