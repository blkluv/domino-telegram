import GUI from "lil-gui";
import {BackendType} from "@azur-games/pixi-vip-framework";
import {GameConfig} from "@azur-games/pixi-vip-framework";
import {FrameworkLocalStorageNames} from "@azur-games/pixi-vip-framework";
import {LocalStorageService} from "@azur-games/pixi-vip-framework";


export class ServerCheats {
    private static data = {
        d1: async (): Promise<void> => {
            await LocalStorageService.setKeyValue(FrameworkLocalStorageNames.PREFERRED_DEV_SERVER, BackendType.D1);
            window.location.reload();

        },
        d2: async (): Promise<void> => {
            await LocalStorageService.setKeyValue(FrameworkLocalStorageNames.PREFERRED_DEV_SERVER, BackendType.D2);
            window.location.reload();
        },
    };

    static addToGui(gui: GUI): void {
        const folder = gui.addFolder("Server");
        folder.add(ServerCheats.data, "d1").enable(GameConfig.backendType == BackendType.D2);
        folder.add(ServerCheats.data, "d2").enable(GameConfig.backendType == BackendType.D1);
        folder.close();
    }

}