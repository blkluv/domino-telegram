import {ButtonBase, DisplayObjectFactory, GraphicsFactory, LoaderService, Pivot} from "@azur-games/pixi-vip-framework";
import {Graphics, NineSlicePlane, Sprite} from "pixi.js";
import {AvatarService} from "../services/AvatarService";
import {PlayerData} from "../services/socket_service/socket_message_data/profile_data/PlayerData";
import {PlayerConfig} from "./player/PlayerConfig";
import {PlayerLevel} from "./player/PlayerLevel";


export class Player extends ButtonBase {
    avatarSize: number = 125;
    private data: PlayerData;
    private background: NineSlicePlane;
    private avatarMask: Graphics;
    private avatar: Sprite;
    private onlineIcon: Sprite;
    private facebookIcon: Sprite;
    private level: PlayerLevel;

    constructor(private config: PlayerConfig = {callback: null, showLevel: true}) {
        super(config.callback, undefined, true);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.enabled = !!config.callback;
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("lobby/avatar_frame", 50, 50, 50, 50);
        this.avatarMask = GraphicsFactory.createRoundedRect(0, 0, this.avatarSize, this.avatarSize, 32);
        this.onlineIcon = DisplayObjectFactory.createSprite("friends/icon_online");
        this.facebookIcon = DisplayObjectFactory.createSprite("friends/icon_facebook_round");
        this.level = new PlayerLevel();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.avatarMask);
        this.addChild(this.onlineIcon).visible = false;
        this.addChild(this.level).visible = this.config.showLevel;
        this.addChild(this.facebookIcon).visible = false;
    }

    initChildren(): void {
        this.background.width = this.avatarSize + 38;
        this.background.height = this.avatarSize + 38;

        Pivot.center(this.background);
        Pivot.center(this.avatarMask);
        Pivot.center(this.onlineIcon);
        Pivot.center(this.facebookIcon);

        this.level.x = 50;
        this.level.y = 50;
        this.onlineIcon.x = 55;
        this.onlineIcon.y = 55;
        this.facebookIcon.x = -60;
        this.facebookIcon.y = -60;
    }

    applyData(playerData: PlayerData): void {
        this.data = playerData;
        this.tryDestroyAvatar();
        this.createNewAvatar();
        this.config.showLevel && this.level.applyData(playerData);
        this.facebookIcon.visible = this.config.showFacebookIcon && this.data.fbConnected;
        this.onlineIcon.visible = this.config.showFacebookIcon;
        this.updateOnlineIcon(this.data.online);
    }

    tryDestroyAvatar(): void {
        if (!this.avatar) {
            return;
        }
        this.avatar.visible = false;
        this.removeChild(this.avatar);
        this.avatar.destroy();
        this.avatar = null;
    }

    createNewAvatar(): void {
        this.setAvatar(AvatarService.getAvatarTextureNameByProfile(this.data));
    }

    setAvatar(avatarTextureName: string): void {
        this.tryDestroyAvatar();
        this.avatar = DisplayObjectFactory.createSprite(avatarTextureName, this.avatarSize);
        this.addChildAt(this.avatar, 1);
        this.avatar.mask = this.avatarMask;
        Pivot.center(this.avatar);
    }

    updateOnlineIcon(online: boolean) {
        this.onlineIcon.texture = LoaderService.getTexture("friends/icon_" + (online ? "online" : "offline"));
    }

    get totalWidth(): number {
        return this.background.width * this.scale.x;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.avatarMask);
        this.removeChild(this.avatar);
        this.removeChild(this.level);
        this.removeChild(this.onlineIcon);
        this.removeChild(this.facebookIcon);

        this.background.destroy();
        this.avatarMask.destroy();
        this.avatar.destroy();
        this.level.destroy();
        this.onlineIcon.destroy();
        this.facebookIcon.destroy();

        this.background = null;
        this.avatarMask = null;
        this.avatar = null;
        this.level = null;
        this.onlineIcon = null;
        this.facebookIcon = null;
        this.config = null;
        this.data = null;

        super.destroy();
    }
}