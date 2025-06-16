import {ItemGroup} from "./emoji_config/ItemGroup";
import {ItemKind} from "./emoji_config/ItemKind";


export type EmojiConfig = {
    kind: ItemKind.GIFT,
    group: ItemGroup,
    id: string,
    cost: number
}