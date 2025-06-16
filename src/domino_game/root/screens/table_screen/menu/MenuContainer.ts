import {Sine, TweenMax} from "gsap";
import {NineSlicePlane} from "pixi.js";
import {ScreenCovering} from "@azur-games/pixi-vip-framework";
import {SocketGameRequestState} from "../../../../../dynamic_data/SocketGameRequestState";
import {DynamicData} from "../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../GameEvents";
import {LazyLoader} from "../../../../../services/loader_service/LazyLoader";
import {PreloaderService} from "@azur-games/pixi-vip-framework";
import {SettingsService} from "../../../../../services/SettingsService";
import {GameMode} from "../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {SocketService} from "../../../../../services/SocketService";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {MenuItem} from "./menu_container/MenuItem";


export class MenuContainer extends ScreenCovering {
    private showTween: TweenMax;
    private background: NineSlicePlane;
    private leaveItem: MenuItem;
    private rulesItem: MenuItem;
    private vibrationItem: MenuItem;
    private musicItem: MenuItem;
    private soundItem: MenuItem;

    constructor() {
        super(.00001, true);
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.interactive = this.interactiveChildren = false;
        this.alpha = 0;
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("table/menu/bg", 32, 40, 143, 21);
        this.leaveItem = new MenuItem(this.onLeaveClick.bind(this), "TableSettingsWindow/leave", "table/menu/exit");
        this.rulesItem = new MenuItem(this.onRulesClick.bind(this), "TableSettingsWindow/rules", "table/menu/help");
        this.vibrationItem = new MenuItem(null, "TableSettingsWindow/vibration", "table/menu/vibration", true, false);
        this.musicItem = new MenuItem(this.onMusicClick.bind(this), "TableSettingsWindow/music", "table/menu/music", true, SettingsService.musicIsOn);
        this.soundItem = new MenuItem(this.onSoundClick.bind(this), "TableSettingsWindow/sound", "table/menu/sound", true, SettingsService.soundIsOn);
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.leaveItem);
        this.addChild(this.rulesItem);
        this.addChild(this.vibrationItem);
        this.addChild(this.musicItem);
        this.addChild(this.soundItem);
    }

    initChildren(): void {
        this.background.width = 330;
        this.background.height = 450;

        Pivot.center(this.background, true, false);

        this.leaveItem.y = 70;
        this.rulesItem.y = 150;
        this.vibrationItem.y = 230;
        this.musicItem.y = 310;
        this.soundItem.y = 390;

        let leaving: boolean = DynamicData.socketGameRequest.state == SocketGameRequestState.LEAVING;
        this.leaveItem.background.visible = leaving;
    }

    overlayToOffset() {
        this.closeOverlay.y = -this.y;
        this.closeOverlay.x = -this.x;
    }

    onOverlayClick(): void {
        this.show(false);
    }

    onLeaveClick(): void {
        let endless: boolean = DynamicData.socketGameRequest.mode == GameMode.PRO;
        let leaving: boolean = DynamicData.socketGameRequest.state == SocketGameRequestState.LEAVING;
        this.leaveItem.background.visible = !leaving && endless;
        if (leaving) {
            SocketService.cancelLeave();
        } else {
            SocketService.tryLeave();
        }
        endless && this.show(false);
    }

    async onRulesClick(): Promise<void> {
        let preloaderId: number = PreloaderService.show();
        await LazyLoader.waitForLazyResources();
        PreloaderService.hide(preloaderId);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_TUTORIAL_POPUP));
    }

    onMusicClick(): void {
        SettingsService.musicIsOn = !SettingsService.musicIsOn;
        this.musicItem.switch(SettingsService.musicIsOn);
    }

    onSoundClick(): void {
        SettingsService.soundIsOn = !SettingsService.soundIsOn;
        this.soundItem.switch(SettingsService.soundIsOn);
    }

    show(value: boolean): void {
        if (value) {
            this.alpha = 0;
            this.visible = true;
        }
        this.showTween?.kill();
        this.showTween = TweenMax.to(this, .2, {
            alpha: value ? 1 : 0,
            ease: Sine.easeInOut,
            onComplete: () => this.visible = value
        });
        this.interactive = this.interactiveChildren = value;
    }

    destroy(): void {
        this.showTween?.kill();
        this.showTween = null;

        this.removeChild(this.background);
        this.removeChild(this.leaveItem);
        this.removeChild(this.rulesItem);
        this.removeChild(this.vibrationItem);
        this.removeChild(this.musicItem);
        this.removeChild(this.soundItem);

        this.background.destroy();
        this.leaveItem.destroy();
        this.rulesItem.destroy();
        this.vibrationItem.destroy();
        this.musicItem.destroy();
        this.soundItem.destroy();

        this.background = null;
        this.leaveItem = null;
        this.rulesItem = null;
        this.vibrationItem = null;
        this.musicItem = null;
        this.soundItem = null;

        super.destroy();
    }
}
