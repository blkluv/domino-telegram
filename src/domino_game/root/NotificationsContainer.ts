import {Sprite} from "pixi.js";
import {LostConnection} from "./notifications_container/LostConnection";
import {MaintenanceAttention} from "./notifications_container/MaintenanceAttention";


export class NotificationsContainer extends Sprite {
    private lostConnection: LostConnection;
    private maintenanceAttention: MaintenanceAttention;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
    }

    createChildren(): void {
        this.lostConnection = new LostConnection();
        this.maintenanceAttention = new MaintenanceAttention();
    }

    addChildren(): void {
        this.addChild(this.lostConnection);
        this.addChild(this.maintenanceAttention);
    }

    destroy() {
        this.removeChild(this.lostConnection);
        this.removeChild(this.maintenanceAttention);
        this.lostConnection.destroy();
        this.maintenanceAttention.destroy();
        this.lostConnection = null;
        this.maintenanceAttention = null;
        super.destroy();
    }

    resize() {
        this.lostConnection.resize();
    }
}