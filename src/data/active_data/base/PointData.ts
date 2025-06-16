import {ActiveData} from '../../ActiveData';
import {BaseData} from '../base/static_config_data/BaseData';
import {PointDataEvent} from './point_data/PointDataEvent';


export class PointData extends BaseData {
    constructor(public config: IPointData) {
        super();
    }

    get x(): number {
        return this.config.x;
    }

    set x(value: number) {
        this.config.x = value;
        ActiveData.addEventToPool<number>(this, PointDataEvent.X_CHANGED, this.config!.x);
    }

    get y(): number {
        return this.config.y;
    }

    set y(value: number) {
        this.config.y = value;
        ActiveData.addEventToPool<number>(this, PointDataEvent.Y_CHANGED, this.config!.y);
    }
}

export interface IPointData {
    x: number;
    y: number;
}
