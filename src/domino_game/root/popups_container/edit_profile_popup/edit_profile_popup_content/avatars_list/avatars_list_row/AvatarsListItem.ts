import {DisplayObjectFactory, Pivot, ScrollItem} from "@azur-games/pixi-vip-framework";
import {TweenMax} from "gsap";
import {NineSlicePlane, Sprite} from "pixi.js";
import {Player} from "../../../../../../../common/Player";
import {DynamicData} from "../../../../../../../DynamicData";
import {GameEvents} from "../../../../../../../GameEvents";
import {AvatarService} from "../../../../../../../services/AvatarService";


export class AvatarsListItem extends ScrollItem {
    private background: NineSlicePlane;
    private player: Player;
    private selectedIcon: Sprite;
    private scaleTween: TweenMax;
    private alphaIconTween: TweenMax;
    private onAvatarChooseBindThis: (e: MessageEvent) => void;

    constructor(private avatar: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.tryToMakeSelected(AvatarService.getAvatarTextureNameByProfile(DynamicData.myProfile));
        this.onAvatarChooseBindThis = this.onAvatarChoose.bind(this);
        addEventListener(GameEvents.CHOOSE_AVATAR, this.onAvatarChooseBindThis);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("edit_profile/avatar_bg", 45, 45, 45, 45);
        this.player = new Player({
            callback: this.onClick.bind(this),
            showLevel: false
        });
        this.selectedIcon = DisplayObjectFactory.createSprite("edit_profile/selected_icon");
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.player);
        this.addChild(this.selectedIcon).alpha = 0;
    }

    initChildren(): void {
        this.background.width = 160;
        this.background.height = 160;

        this.player.setAvatar(this.avatar);

        Pivot.center(this.background);

        this.background.y = 1;
        this.selectedIcon.y = 20;
        this.selectedIcon.x = 20;
    }

    async tryToMakeSelected(avatar: string): Promise<void> {
        this.cacheAsBitmap = false;
        let selected: boolean = avatar == this.avatar;
        let scale: number = selected ? 1.2 : 1;

        this.alphaIconTween?.kill();
        await new Promise(resolve => this.alphaIconTween = TweenMax.to(this.selectedIcon, .05, {
            alpha: selected ? 1 : 0,
            onComplete: resolve
        }));

        this.cacheAsBitmap = true;

        this.scaleTween?.kill();
        this.scaleTween = TweenMax.to(this.scale, .3, {x: scale, y: scale});
    }

    onAvatarChoose(e: MessageEvent): void {
        let avatar: string = e.data;
        this.tryToMakeSelected(avatar);
    }

    onClick(): void {
        this.dragged || dispatchEvent(new MessageEvent(GameEvents.CHOOSE_AVATAR, {data: this.avatar}));
    }

    destroy(): void {
        this.cacheAsBitmap = false;

        removeEventListener(GameEvents.CHOOSE_AVATAR, this.onAvatarChooseBindThis);
        this.onAvatarChooseBindThis = null;

        this.scaleTween?.kill();
        this.alphaIconTween?.kill();

        this.scaleTween = null;
        this.alphaIconTween = null;

        this.removeChild(this.player);
        this.removeChild(this.background);
        this.removeChild(this.selectedIcon);

        this.background.destroy();
        this.player.destroy();
        this.selectedIcon.destroy();

        this.background = null;
        this.player = null;
        this.selectedIcon = null;

        super.destroy();
    }
}
