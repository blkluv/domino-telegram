import {utils} from 'pixi.js';


export class GameEventContainer<T> {
    constructor(
        public dispatcher: utils.EventEmitter,
        public eventName: string,
        public data?: T) {
    }

    dispatchEvent(): void {
        //console.log(this.eventName, JSON.stringify(this.data));
        this.dispatcher.emit(this.eventName, this.data);
        delete this.dispatcher;
        delete this.eventName;
        delete this.data;
    }
}
