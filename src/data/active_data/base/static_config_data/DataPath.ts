export class DataPath {
    private pathSplit: Array<string>;

    constructor(path: string) {
        this.pathSplit = path.split(".");
    }

    getFirstPathNode(): string {
        return this.pathSplit[0];
    }

    getSecondPathNode(): string {
        return this.pathSplit[1];
    }

    splicePath(nodesUnshiftCount: number = 1): void {
        this.pathSplit.splice(0, nodesUnshiftCount);
    }
}
