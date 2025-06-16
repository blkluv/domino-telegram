import * as jsonPatchFormatter from "jsondiffpatch/formatters/jsonpatch";
import {utils} from 'pixi.js';
import {ISocketGameState} from "../dynamic_data/ISocketGameState";
import {GameEvents} from "../GameEvents";
import {GameEventContainer} from './active_data/base/static_config_data/GameEventContainer';
import {GameStateData} from './active_data/GameStateData';


export class ActiveData {
    static gameStateData: GameStateData;

    static eventsPool: Array<GameEventContainer<any>> = [];
    static eventsAfterPatch: boolean = true;

    static init(): void {
        addEventListener(GameEvents.ON_STATE_DELTA, ActiveData.onStateDelta);
    }

    static onStateDelta(e: MessageEvent): void {
        ActiveData.applyJsonPatchArray(jsonPatchFormatter.format(e.data));
    }

    static hideEvents(): void {
        ActiveData.eventsAfterPatch = false;
    }

    static applyJsonPatchArray(patchArray: jsonPatchFormatter.Op[]): void {
        if (!patchArray) {
            return;
        }
        // console.log("LOG: patch", patchArray, !!ActiveData.gameStateData);
        ActiveData.gameStateData?.applyJsonPatchArray(patchArray);
    }

    static showEvents(): void {
        ActiveData.eventsAfterPatch = true;
    }

    static createClasses(socketGameState: ISocketGameState): void {
        ActiveData.gameStateData = new GameStateData(socketGameState);
    }

    static addEventToPool<T>(dispatcher: utils.EventEmitter, event: string, data?: T): void {
        let eventContainer: GameEventContainer<T> = new GameEventContainer<T>(dispatcher, event, data);
        ActiveData.eventsPool.push(eventContainer);
    }

    static dispatchEventsPool(): void {
        if (!ActiveData.eventsAfterPatch) {
            ActiveData.eventsPool = [];
            return;
        }
        let eventContainer: GameEventContainer<any>;
        while (ActiveData.eventsPool.length > 0) {
            eventContainer = ActiveData.eventsPool.shift() as GameEventContainer<any>;
            eventContainer.dispatchEvent();
        }
    }
}
