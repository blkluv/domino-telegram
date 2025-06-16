import {utils} from 'pixi.js';
import {ActiveData} from '../../../ActiveData';
import {BaseDataEvent} from './base_data/BaseDataEvent';
import {DataPath} from './DataPath';


export class NumberData extends utils.EventEmitter {
    constructor(value: number | null) {
        super();
        this._value = value!;
    }

    private _value: number;

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
        ActiveData.addEventToPool<number>(this, BaseDataEvent.VALUE_CHANGED, this._value);
    }

    parseDataPath(dataPath: DataPath): string {
        return this._value + '';
    }
}
