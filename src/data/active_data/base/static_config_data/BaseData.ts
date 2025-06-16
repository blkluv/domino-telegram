import {Op} from "jsondiffpatch/formatters/jsonpatch";
import {utils} from 'pixi.js';
import {ActiveData} from '../../../ActiveData';
import {ArrayWrap} from './ArrayWrap';
import {BaseDataEvent} from './base_data/BaseDataEvent';
import {BooleanData} from './BooleanData';
import {DataPath} from './DataPath';
import {Operation} from './json_patch/Operation';
import {IJsonPatch, JsonPatch} from './JsonPatch';
import {NumberData} from './NumberData';
import {StringData} from './StringData';


export class BaseData extends utils.EventEmitter<string> {
    constructor() {
        super();
    }

    applyJsonPatchArray(patchArray: Op[]): void {
        for (let patch of patchArray) {
            this.applyJsonPatch(new JsonPatch(patch as IJsonPatch));
        }

        ActiveData.dispatchEventsPool();
    }

    dispatchDelete(): void {
        ActiveData.addEventToPool(this, BaseDataEvent.DELETED);
    }

    applyJsonPatch(patch: JsonPatch): void {
        switch (patch.op) {
            case Operation.REPLACE:
                this.applyReplacePatch(patch);
                break;
            case Operation.ADD:
                this.applyAddPatch(patch);
                break;
            case Operation.REMOVE:
                this.applyRemovePatch(patch);
                break;
        }
    }

    applyReplacePatch(patch: JsonPatch): void {
        let firstPathNode: string = patch.getFirstPathNode();
        let a: any = this;
        let fieldValue: any = a[firstPathNode];
        let isArray: boolean = fieldValue instanceof ArrayWrap;

        if (isArray) {
            let array: ArrayWrap<any, any> = fieldValue;
            let nodeIndex: number = parseInt(patch.getSecondPathNode());
            let arrayValue = array.getAt(nodeIndex);

            if (arrayValue instanceof NumberData) {
                arrayValue.value = parseInt(patch.value);
                return;
            }

            if (arrayValue instanceof StringData) {
                arrayValue.value = patch.value;
                return;
            }

            if (arrayValue instanceof BooleanData) {
                arrayValue.value = patch.value;
                return;
            }

            if (arrayValue instanceof BaseData) {
                patch.splicePath(2);
                arrayValue.applyJsonPatch(patch);
                return;
            }
        }
        let typeOf: string = typeof fieldValue;
        if (['number', "string", "boolean"].includes(typeOf)) {
            a[firstPathNode] = patch.value;
            return;
        }

        if (fieldValue instanceof BaseData) {
            patch.splicePath(1);
            (fieldValue as BaseData).applyJsonPatch(patch);
            return;
        }
    }

    applyAddPatch(patch: JsonPatch): void {
        let firstPathNode: string = patch.getFirstPathNode();
        let a: any = this;
        let fieldValue: any = a[firstPathNode];
        let isArray: boolean = fieldValue instanceof ArrayWrap;
        if (isArray) {
            let array: ArrayWrap<any, any> = fieldValue;
            let nodeIndex: number = parseInt(patch.getSecondPathNode());

            if (array.emptyInstance instanceof NumberData) {
                array.push(patch.value);
                return;
            }

            if (array.emptyInstance instanceof StringData) {
                array.push(patch.value);
                return;
            }

            if (array.emptyInstance instanceof BooleanData) {
                array.push(patch.value);
                return;
            }

            if (array.emptyInstance instanceof BaseData) {
                if (patch.length == 3) {
                    array.push(patch.value);
                } else {
                    patch.splicePath(2);
                    (array.getAt(nodeIndex) as BaseData).applyJsonPatch(patch);
                }
                return;
            }
            return;
        }

        if (fieldValue instanceof BaseData) {
            patch.splicePath(1);
            (fieldValue as BaseData).applyJsonPatch(patch);
            return;
        }

        if (fieldValue == null) {
            a[firstPathNode] = patch.value;
        }
    }

    applyRemovePatch(patch: JsonPatch): void {
        let firstPathNode: string = patch.getFirstPathNode();
        let a: any = this;
        let fieldValue: any = a[firstPathNode];
        let isArray: boolean = (fieldValue instanceof ArrayWrap);
        if (isArray) {
            let array: ArrayWrap<any, any> = fieldValue;
            let nodeIndex: number = parseInt(patch.getSecondPathNode());
            if (patch.length == 3) {
                array.splice(nodeIndex, 1);
            } else {
                patch.splicePath(2);
                (array.getAt(nodeIndex) as BaseData).applyJsonPatch(patch);
            }
            return;
        }

        if (fieldValue instanceof BaseData) {
            patch.splicePath(1);
            (fieldValue as BaseData).applyJsonPatch(patch);
            return;
        }
    }

    parseDataPath(dataPath: DataPath): string {
        let firstPathNode: string = dataPath.getFirstPathNode();
        let a: any = this;
        let fieldValue: any = a[firstPathNode];
        let isArray: boolean = (fieldValue instanceof ArrayWrap);

        if (isArray) {
            let array: ArrayWrap<any, any> = fieldValue;
            let nodeIndex: number = parseInt(dataPath.getSecondPathNode());
            let arrayValue = array.getAt(nodeIndex);

            if (typeof arrayValue == 'number') {
                return arrayValue + '';
            }

            if (typeof arrayValue == 'string') {
                return arrayValue;
            }

            if (arrayValue instanceof BaseData) {
                dataPath.splicePath(2);
                return (arrayValue as BaseData).parseDataPath(dataPath);
            }
        }

        if (typeof fieldValue == 'number') {
            return fieldValue + '';
        }

        if (typeof fieldValue == 'string') {
            return fieldValue;
        }

        dataPath.splicePath(1);
        return (fieldValue as BaseData).parseDataPath(dataPath);
    }
}
