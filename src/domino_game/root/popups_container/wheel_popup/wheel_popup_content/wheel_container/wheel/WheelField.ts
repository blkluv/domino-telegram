import {Sprite} from "pixi.js";
import {IPoint} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {WheelSector} from "./wheel_field/WheelSector";


export class WheelField extends Sprite {
    private background: Sprite;
    private sectors: WheelSector[];

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("wheel/wheel_field");
        this.sectors = DynamicData.wheel.sectors.map(sector => new WheelSector(sector.coins.toString()));
    }

    addChildren(): void {
        this.addChild(this.background);
        this.sectors.forEach(sector => this.addChild(sector));
    }

    initChildren(): void {
        Pivot.center(this.background);

        let sectorsAngles: number[] = [90, 126, 162, -162, -126, -90, -54, -18, 18, 54];
        let sectorsCoords: IPoint[] = [
            {x: 0, y: -213},
            {x: 126, y: -172},
            {x: 203, y: -65},
            {x: 202, y: 67},
            {x: 125, y: 173},
            {x: -1, y: 213},
            {x: -126, y: 171},
            {x: -203, y: 65},
            {x: -202, y: -66},
            {x: -124, y: -173}
        ];
        this.sectors.forEach((sector, i) => {
            sector.angle = sectorsAngles[i];
            sector.x = sectorsCoords[i].x;
            sector.y = sectorsCoords[i].y;
        });
    }

    destroy(): void {
        this.removeChild(this.background);
        this.background.destroy();
        this.background = null;

        let sector: WheelSector;
        while (this.sectors.length) {
            sector = this.sectors.shift();
            this.removeChild(sector);
            sector.destroy();
        }

        super.destroy();
    }
}
