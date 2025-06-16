import {utils} from 'pixi.js';
import {ActiveData} from '../../../ActiveData';
import {BaseDataEvent} from './base_data/BaseDataEvent';
import {DataPath} from './DataPath';


export class BooleanData extends utils.EventEmitter {
    constructor(value: boolean | null) {
        super();
        this._value = value!;
    }

    private _value: boolean;

    get value(): boolean {
        return this._value;
    }

    set value(value: boolean) {
        this._value = value;
        ActiveData.addEventToPool<boolean>(this, BaseDataEvent.VALUE_CHANGED, this._value);
    }

    parseDataPath(dataPath: DataPath): string {
        return (this._value ? 1 : 0) + '';
    }
}
