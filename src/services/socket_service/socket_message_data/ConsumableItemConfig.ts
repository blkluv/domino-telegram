import {ItemKind} from "./emoji_config/ItemKind";


export type ConsumableItemConfig = {
    createdAt: string,
    id: number,
    itemCount: number,
    itemId: string,
    itemKind: ItemKind,
    profileId: number,
    updatedAt: string
}