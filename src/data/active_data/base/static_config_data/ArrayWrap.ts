import {utils} from 'pixi.js';
import {ActiveData} from '../../../ActiveData';
import {ArrayWrapEvent} from './array_wrap/ArrayWrapEvent';
import {ArrayWrapEventData} from './array_wrap/ArrayWrapEventData';
import {BaseData} from './BaseData';
import {BooleanData} from './BooleanData';
import {NumberData} from './NumberData';
import {StringData} from './StringData';


export class ArrayWrap<T extends BaseData | StringData | NumberData | BooleanData, U> extends utils.EventEmitter {
    classes: Array<T>;
    interfaces: Array<U>;
    emptyInstance: T;

    constructor(private instanceClass: {new(...args: any[]): T}, interfaces: Array<U> | null = null) {
        super();
        this.emptyInstance = new this.instanceClass();
        this.classes = new Array<T>();

        if (interfaces == null) {
            throw new Error('INTERAFECES == NULL');
        }

        this.interfaces = interfaces;

        for (let interfaceItem of interfaces) {
            this.initPush(new this.instanceClass(interfaceItem));
        }
    }

    get length(): number {
        return this.classes.length;
    }

    setAt(index: number, x: T, y: U): void {
        this.classes[index] = x;
        this.interfaces[index] = y;
        ActiveData.addEventToPool<ArrayWrapEventData<T>>(this, ArrayWrapEvent.ELEMENT_CHANGED,
            {
                index,
                value: x
            }
        );
    }

    getAt(index: number): T {
        return this.classes[index];
    }

    getLast(): T {
        return this.classes[this.classes.length - 1];
    }

    pop(): T | undefined {
        let lastIndex: number = this.classes.length - 1;
        ActiveData.addEventToPool<ArrayWrapEventData<T>>(this, ArrayWrapEvent.ELEMENT_REMOVED,
            {
                index: lastIndex,
                value: this.getAt(lastIndex)
            }
        );
        this.interfaces.pop();
        return this.classes.pop();
    }

    push(y: U): number {
        let len: number = this.interfaces.push(y);
        let x: T = new this.instanceClass(y);
        this.initPush(x);
        ActiveData.addEventToPool<ArrayWrapEventData<T>>(this, ArrayWrapEvent.ELEMENT_ADDED, {
                index: len - 1,
                value: x
            }
        );
        return len;
    }

    initPush(x: T): number {
        return this.classes.push(x);
    }

    reverse(): void {
        this.interfaces.reverse();
        this.classes.reverse();
    }

    shift(): T | undefined {
        this.interfaces.shift();
        return this.classes.shift();
    }

    slice(pos: number, end?: number): Array<T> {
        this.interfaces.slice(pos, end);
        return this.classes.slice(pos, end);
    }

    sort(f: (a: T | U, b: T | U) => number): void {
        this.interfaces.sort(f);
        this.classes.sort(f);
    }

    remove(x: T): void {
        if (this.classes.indexOf(x) == -1) {
            return;
        }

        this.splice(this.classes.indexOf(x), 1);
    }

    splice(pos: number, len: number): Array<T> {
        for (let x = pos; x < pos + len; x++) {
            ActiveData.addEventToPool<ArrayWrapEventData<T>>(this, ArrayWrapEvent.ELEMENT_REMOVED, {
                    index: x,
                    value: this.getAt(x)
                }
            );
        }
        this.interfaces.splice(pos, len);
        return this.classes.splice(pos, len);
    }

    toString(): string {
        return this.classes.toString();
    }

    unshift(y: U): void {
        this.insert(0, y);
    }

    insert(pos: number, y: U): void {
        let x: T = new this.instanceClass(y);
        this.interfaces.splice(pos, 0, y);
        this.classes.splice(pos, 0, x);

        ActiveData.addEventToPool<ArrayWrapEventData<T>>(this, ArrayWrapEvent.ELEMENT_ADDED, {
                index: pos,
                value: x
            }
        );
    }

    indexOf(x: T, fromIndex?: number): number {
        return this.classes.indexOf(x, fromIndex);
    }

    indexOfInner(x: U, fromIndex?: number): number {
        return this.interfaces.indexOf(x, fromIndex);
    }

    lastIndexOf(x: T, fromIndex?: number): number {
        return this.classes.lastIndexOf(x, fromIndex);
    }
}
