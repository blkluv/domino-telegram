import {ProductGoods} from "./product_data/ProductGoods";
import {ProductTag} from "./product_data/ProductTag";
import {ProductType} from "./product_data/ProductType";


export type ProductData = {
    storePrices: {ton: {currency: string, amount: string}};
    period?: number;
    id: string,
    storeIds: {
        ton: string;
        googlePlay: string,
        appStore: string,
        web: string,
        xsolla: string,
        fbinstant: string
    },
    productType: ProductType,
    description: string,
    goodsInstant: ProductGoods,
    goodsSubscription?: {},
    goodsBonus?: ProductGoods,
    name: string,
    price: string,
    tags?: ProductTag[]
}

