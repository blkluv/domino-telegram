import {Limit} from "./xsolla_item_config/XsollaItemLimit";


export type XsollaItemConfig = {
    item_id: number,
    sku: string,
    type: string,
    name: string,
    description: string,
    image_url: string,
    price: {
        amount: string,
        amount_without_discount: string,
        currency: string
    };
    virtual_prices: [],
    can_be_bought: boolean,
    promotions: [],
    limits: {
        "per_user": Limit,
        per_item: Limit
    };
    periods: [],
    attributes: [],
    is_free: boolean,
    groups: [],
    virtual_item_type: string,
    vp_rewards: [],
    inventory_options: {
        consumable: {
            usages_count: number
        },
        expiration_period: number,
    }
}