import {utils} from 'pixi.js';
import {ActiveData} from '../../../ActiveData';
import {BaseDataEvent} from './base_data/BaseDataEvent';
import {DataPath} from './DataPath';


export class StringData extends utils.EventEmitter {
    constructor(value: string | null) {
        super();
        this._value = value!;
    }

    private _value: string;

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
        ActiveData.addEventToPool<string>(this, BaseDataEvent.VALUE_CHANGED, this._value);
    }

    parseDataPath(dataPath: DataPath): string {
        return this._value;
    }
}
