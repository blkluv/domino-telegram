import {DisplayObjectFactory, LanguageText, Pivot} from "@azur-games/pixi-vip-framework";
import {NineSlicePlane, Sprite, Text} from "pixi.js";


export class MaintenancePopupContent extends Sprite {
    private background: NineSlicePlane;
    private rhomb: Sprite;
    private spacer: NineSlicePlane;
    private maintenanceText: Text;
    private thanksText: Text;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("maintenance/bg", 50, 50, 50, 170);
        this.rhomb = DisplayObjectFactory.createSprite("maintenance/rhomb");
        this.spacer = DisplayObjectFactory.createNineSlicePlane("maintenance/spacer", 1, 1, 1, 1);
        this.maintenanceText = new LanguageText({key: "Maintenance.in-progress-message", fontSize: 42, fill: 0xffc400, fontWeight: "500"});
        this.thanksText = new LanguageText({key: "Maintenance.in-progress-submessage", fontSize: 38, fill: 0xffffff, fontWeight: "500"});
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.rhomb);
        this.addChild(this.spacer);
        this.addChild(this.maintenanceText);
        this.addChild(this.thanksText);
    }

    initChildren() {
        this.background.width = 800;
        this.background.height = 412;

        this.spacer.width = 758;
        this.spacer.height = 122;

        this.maintenanceText.style.stroke = 0x777777;
        this.maintenanceText.style.strokeThickness = 6;

        Pivot.center(this.background);
        Pivot.center(this.rhomb);
        Pivot.center(this.spacer);
        Pivot.center(this.maintenanceText);
        Pivot.center(this.thanksText);

        this.spacer.y = 100;
        this.maintenanceText.y = 70;
        this.thanksText.y = 120;
    }

    destroy(): void {
        this.removeChild(this.background);
        this.removeChild(this.rhomb);
        this.removeChild(this.spacer);
        this.removeChild(this.maintenanceText);
        this.removeChild(this.thanksText);

        this.background.destroy();
        this.rhomb.destroy();
        this.spacer.destroy();
        this.maintenanceText.destroy();
        this.thanksText.destroy();

        this.background = null;
        this.rhomb = null;
        this.spacer = null;
        this.maintenanceText = null;
        this.thanksText = null;

        super.destroy();
    }
}
