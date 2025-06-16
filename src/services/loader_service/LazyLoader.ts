import {LoaderService} from "@azur-games/pixi-vip-framework";


export class LazyLoader {
    private static lazyResources: string[] = [];
    private static lazyAtlasesNames: string[];
    private static onLazyResourcesReady: Function;
    private static lazyResourcesReady: boolean;

    private static completeLazyResourcesLoad(): void {
        LoaderService.addSheetsByAtlasesName(LazyLoader.lazyAtlasesNames);
        console.log("lazy resources loaded");
        LazyLoader.lazyResourcesReady = true;
        LazyLoader.onLazyResourcesReady && LazyLoader.onLazyResourcesReady();
    }

    private static addAtlasesToResources(atlasesNames: string[]): void {
        atlasesNames.forEach(atlasName => LazyLoader.lazyResources.push("./assets/atlases/" + atlasName + ".json"));
    }

    private static defineLazyResources(): void {
        LazyLoader.lazyAtlasesNames = [
            "lazy"
        ];
        let spines: string[] = [];

        LoaderService.atlasesNames = LoaderService.atlasesNames.concat(LazyLoader.lazyAtlasesNames);
        LoaderService.addAtlasesToResources(LazyLoader.lazyAtlasesNames);
        LazyLoader.addAtlasesToResources(LazyLoader.lazyAtlasesNames);
        LazyLoader.lazyResources.push(...spines);
    }

    static loadLazyResources(): void {
        LazyLoader.defineLazyResources();
        LoaderService.addResourcesToLoader(LazyLoader.lazyResources);
        LoaderService.loader.load(LazyLoader.completeLazyResourcesLoad);
    }

    static async waitForLazyResources(): Promise<void> {
        if (LazyLoader.lazyResourcesReady) {
            return;
        }
        await new Promise(resolve => LazyLoader.onLazyResourcesReady = resolve);
    }
}