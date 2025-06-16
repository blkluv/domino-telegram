import {Sprite} from "pixi.js";
import {Preloader} from "../services/preloader_service/Preloader";

import {NotificationsContainer} from "./root/NotificationsContainer";
import {PopupsContainer} from "./root/PopupsContainer";
import {Screens} from "./root/Screens";


export class Root extends Sprite {
    screens: Screens;
    popupsContainer: PopupsContainer;
    notificationContainer: NotificationsContainer;
    preloader: Preloader;

    constructor() {
        super();

        this.scale.x = .3;
        this.scale.y = .3;

        this.screens = new Screens();
        this.popupsContainer = new PopupsContainer();
        this.notificationContainer = new NotificationsContainer();
        this.preloader = new Preloader();
        this.addChild(this.screens);
        this.addChild(this.popupsContainer);
        this.addChild(this.notificationContainer);
        this.addChild(this.preloader);
    }

    resize() {
        this.notificationContainer.resize();
    }
}