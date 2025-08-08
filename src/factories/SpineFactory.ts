import {ISkeletonData, Spine} from "pixi-spine";
import {CatAnimation} from "@azur-games/pixi-vip-framework";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {LobbySpineName} from "./spine_factory/LobbySpineName";
import {WheelAnimation} from "./spine_factory/WheelAnimation";


export class SpineFactory {
    static createLevelUpSpine(): Spine {
        let spine: Spine = new Spine(LoaderService.loader.resources.level_up!.spineData);
        spine.state.setAnimation(0, "0-2", false);
        return spine;
    }

    static createGiftSpine(): Spine {
        let spine: Spine = new Spine(LoaderService.loader.resources.gifts!.spineData);
        spine.state.setEmptyAnimation(0, 0);
        return spine;
    }

    static createCat(animation: CatAnimation): Spine {
        let spineData: ISkeletonData = LoaderService.loader.resources["all_cats"]!.spineData;
        let spine: Spine = new Spine(spineData);
        spine.state.setAnimation(0, animation, true);
        return spine;
    }
}