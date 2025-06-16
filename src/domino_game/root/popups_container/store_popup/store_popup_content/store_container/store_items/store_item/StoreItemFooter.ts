import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../../../GameEvents";
import {PlatformService} from "@azur-games/pixi-vip-framework";
import {ProductData} from "../../../../../../../../services/socket_service/socket_message_data/ProductData";
import {GlobalPosition} from "../../../../../../../../utils/GlobalPosition";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class StoreItemFooter extends Sprite {
    private background: NineSlicePlane;
    private buyButton: Button;
    coinIconOffsetX: number;

    constructor(private productData: ProductData) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("store/footer_bg", 44, 20, 44, 44);
        this.buyButton = new Button({
            callback: this.onBuyButtonClick.bind(this),
            bgTextureName: "store/buy_button",
            bgSizes: new Point(240, 69),
            bgCornersSize: 30,
            textKey: PlatformService.platformApi.getTotalPrice(this.productData.id),
            fontSize: 36,
            fontColor: 0xffffff,
            textPosition: new Point(0, -2)
        });
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.buyButton);
    }

    initChildren(): void {
        this.background.width = 264;
        this.background.height = 85;

        this.buyButton.languageText?.setTextStroke(0x337F17, 6);

        Pivot.center(this.background);

        this.buyButton.y = -4;
    }

    async onBuyButtonClick(): Promise<void> {
        let result: boolean = await PlatformService.platformApi.createPurchase(this.productData);
        if (!result) {
            return;
        }
        let globalPosition: Point = GlobalPosition.getGlobalPosition(this.toGlobal(new Point()));
        let startPosition: Point = new Point(globalPosition.x + this.coinIconOffsetX, globalPosition.y - 100);
        dispatchEvent(new MessageEvent(GameEvents.ON_CLAIM_COINS, {data: {startPosition, coinsAmount: this.productData.goodsInstant.coin}}));
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.buyButton);

        this.background.destroy();
        this.buyButton.destroy();

        this.background = null;
        this.buyButton = null;
        this.productData = null;

        super.destroy();
    }
}
