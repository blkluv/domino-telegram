import {Operation} from './json_patch/Operation';


export class JsonPatch implements IJsonPatch {
    op: Operation;
    value: any;
    path: string;

    private pathSplit: Array<string>;

    constructor(patch: IJsonPatch) {
        this.op = patch.op;
        this.value = patch.value;
        this.path = patch.path;
        this.pathSplit = patch.path.split('/');
    }

    get length(): number {
        return this.pathSplit.length;
    }

    getFirstPathNode(): string {
        return this.pathSplit[1];
    }

    getSecondPathNode(): string {
        return this.pathSplit[2];
    }

    splicePath(nodesUnshiftCount: number = 1): void {
        this.pathSplit.splice(0, nodesUnshiftCount);
    }
}

export interface IJsonPatch {
    op: Operation;
    path: string;
    value: any;
}
