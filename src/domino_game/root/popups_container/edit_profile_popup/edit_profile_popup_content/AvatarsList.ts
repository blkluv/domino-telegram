import {DisplayObjectFactory, Pivot, ScrollContainer} from "@azur-games/pixi-vip-framework";
import {Point, Sprite} from "pixi.js";
import {AvatarConfig} from "../../../../../services/avatar_service/AvatarConfig";
import {AvatarService} from "../../../../../services/AvatarService";
import {AvatarsListRow} from "./avatars_list/AvatarsListRow";
import {ListBlurEdge} from "./ListBlurEdge";


export class AvatarsList extends ScrollContainer<AvatarsListRow> {
    private topEdge: ListBlurEdge;
    private bottomEdge: ListBlurEdge;
    private spriteMask: Sprite;

    constructor() {
        super({
            maskSizes: new Point(900, 750),
            maskPosition: new Point(0, 375),
            marginBetweenItems: 180,
            bottomMargin: 0,
            topMargin: 150,
            overTheEdgeMargin: 50,
            scrollBarTexture: "edit_profile/scrollbar",
            scrollBarMinHeight: 100,
        });
        this.createAvatars();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.topEdge = new ListBlurEdge();
        this.bottomEdge = new ListBlurEdge();
        this.spriteMask = DisplayObjectFactory.createSprite("edit_profile/mask");
    }

    addChildren(): void {
        this.addChild(this.spriteMask);
        this.addChild(this.topEdge);
        this.addChild(this.bottomEdge);
    }

    initChildren(): void {

        this.spriteMask.width = this.config.maskSizes.x;
        this.spriteMask.height = this.config.maskSizes.y;
        Pivot.center(this.spriteMask);

        this.listMask.visible = false;
        this.mask = null;
        this.mask = this.spriteMask;

        this.spriteMask.y = this.config.maskPosition.y;
        this.bottomEdge.y = 800;
        this.topEdge.y = -75;
        this.scrollBar.x = -430;
    }

    createAvatars(): void {
        let avatarsInRows: string[][] = [[]];
        let columns: number = 4;
        let currentRow: number = 0;
        AvatarService.avatars.forEach((avatar: AvatarConfig, i: number) => {
            if (i != 0 && i % columns == 0) {
                avatarsInRows.push([]);
                ++currentRow;
            }
            avatarsInRows[currentRow].push(avatar.textureName);
        });
        this.createList(avatarsInRows.map(avatarsRow => new AvatarsListRow(avatarsRow)));
    }

    destroy(): void {
        this.removeChild(this.topEdge);
        this.removeChild(this.bottomEdge);
        this.removeChild(this.spriteMask);

        this.topEdge.destroy();
        this.bottomEdge.destroy();
        this.spriteMask.destroy();

        this.topEdge = null;
        this.bottomEdge = null;
        this.spriteMask = null;
        super.destroy();
    }
}
