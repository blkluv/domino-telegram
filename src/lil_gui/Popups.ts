import GUI from "lil-gui";
import {SocketService} from "../services/SocketService";


export class Popups {
    private static data = {
        // levelup: () => {
        //     dispatchEvent(new MessageEvent(GameEvents.OPEN_LEVEL_UP_POPUP, {
        //         data: {
        //             body: {
        //                 "prevLevel": 2,
        //                 "level": 3,
        //                 "coins": 200,
        //                 "coinsRef": [
        //                     "level_up",
        //                     "3"
        //                 ]
        //             }
        //         }
        //     }));
        // },
        wheelReset: () => {
            SocketService.wheelReset();
        },
        // videoOffer: () => {
        //     dispatchEvent(new MessageEvent(GameEvents.OPEN_VIDEO_OFFER_POPUP));
        // },
        // specialVideoOffer: () => {
        //     dispatchEvent(new MessageEvent(GameEvents.OPEN_SPECIAL_VIDEO_OFFER_POPUP));
        // }
    };

    static addToGui(gui: GUI) {
        const folder = gui.addFolder("Popups");
        // folder.add(Popups.data, "levelup");
        folder.add(Popups.data, "wheelReset");
        // folder.add(Popups.data, "videoOffer");
        // folder.add(Popups.data, "specialVideoOffer");
        folder.close();
    }

}