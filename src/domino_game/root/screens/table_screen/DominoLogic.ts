import {Mesh3D, Model, PickingHitArea, StandardMaterial} from "pixi3d";
import {LoaderService} from "@azur-games/pixi-vip-framework";
import {Direction} from "./domino_logic/Direction";
import {DominoNumber} from "./domino_logic/DominoNumber";
import {DominoMaterial} from "./DominoMaterial";


export class DominoLogic {
    static model: Model;
    static meshes: Map<DominoNumber, Map<DominoNumber, Mesh3D>>;
    static usedMeshes: Map<Mesh3D, boolean> = new Map<Mesh3D, boolean>();
    static material: StandardMaterial;

    static initDomino(): void {
        DominoLogic.material = new DominoMaterial();

        // @ts-ignore
        let gltf = LoaderService.loader.resources["Domino"].gltf;
        DominoLogic.model = Model.from(gltf, {
            create: () => DominoLogic.material
        });

        DominoLogic.model.scale.x = .15;
        DominoLogic.model.scale.y = .15;

        DominoLogic.meshes = new Map<DominoNumber, Map<DominoNumber, Mesh3D>>();
        DominoLogic.meshes.set(1, new Map<DominoNumber, Mesh3D>());
        DominoLogic.meshes.get(1).set(1, DominoLogic.model.meshes[0]);
        DominoLogic.meshes.get(1).set(2, DominoLogic.model.meshes[1]);
        DominoLogic.meshes.get(1).set(3, DominoLogic.model.meshes[2]);
        DominoLogic.meshes.get(1).set(4, DominoLogic.model.meshes[3]);
        DominoLogic.meshes.get(1).set(5, DominoLogic.model.meshes[4]);
        DominoLogic.meshes.get(1).set(6, DominoLogic.model.meshes[5]);
        DominoLogic.meshes.set(0, new Map<DominoNumber, Mesh3D>());
        DominoLogic.meshes.get(0).set(0, DominoLogic.model.meshes[6]);
        DominoLogic.meshes.get(0).set(1, DominoLogic.model.meshes[7]);
        DominoLogic.meshes.get(0).set(2, DominoLogic.model.meshes[8]);
        DominoLogic.meshes.get(0).set(3, DominoLogic.model.meshes[9]);
        DominoLogic.meshes.get(0).set(4, DominoLogic.model.meshes[10]);
        DominoLogic.meshes.get(0).set(5, DominoLogic.model.meshes[11]);
        DominoLogic.meshes.get(0).set(6, DominoLogic.model.meshes[12]);
        DominoLogic.meshes.set(2, new Map<DominoNumber, Mesh3D>());
        DominoLogic.meshes.get(2).set(2, DominoLogic.model.meshes[13]);
        DominoLogic.meshes.get(2).set(3, DominoLogic.model.meshes[14]);
        DominoLogic.meshes.get(2).set(4, DominoLogic.model.meshes[15]);
        DominoLogic.meshes.get(2).set(5, DominoLogic.model.meshes[16]);
        DominoLogic.meshes.get(2).set(6, DominoLogic.model.meshes[17]);
        DominoLogic.meshes.set(3, new Map<DominoNumber, Mesh3D>());
        DominoLogic.meshes.get(3).set(3, DominoLogic.model.meshes[18]);
        DominoLogic.meshes.get(3).set(4, DominoLogic.model.meshes[19]);
        DominoLogic.meshes.get(3).set(5, DominoLogic.model.meshes[20]);
        DominoLogic.meshes.get(3).set(6, DominoLogic.model.meshes[21]);
        DominoLogic.meshes.set(4, new Map<DominoNumber, Mesh3D>());
        DominoLogic.meshes.get(4).set(4, DominoLogic.model.meshes[22]);
        DominoLogic.meshes.get(4).set(5, DominoLogic.model.meshes[23]);
        DominoLogic.meshes.get(4).set(6, DominoLogic.model.meshes[24]);
        DominoLogic.meshes.set(5, new Map<DominoNumber, Mesh3D>());
        DominoLogic.meshes.get(5).set(5, DominoLogic.model.meshes[25]);
        DominoLogic.meshes.get(5).set(6, DominoLogic.model.meshes[26]);
        DominoLogic.meshes.set(6, new Map<DominoNumber, Mesh3D>());
        DominoLogic.meshes.get(6).set(6, DominoLogic.model.meshes[27]);

        for (let index: number = 0; index < 28; index++) {
            let mesh3D = DominoLogic.model.meshes[index];
            mesh3D.hitArea = new PickingHitArea(mesh3D);
            mesh3D.scale.set(1, 1, 1);
        }

        DominoLogic.resetUsed();

    }

    static directionsSum(direction1: Direction, direction2: Direction): Direction {
        return (direction1 + direction2) % 4 as Direction;
    }

    static createCoin(): Model {
        // @ts-ignore
        let gltf = LoaderService.loader.resources["coin"].gltf;
        let material = new StandardMaterial();
        material.baseColorTexture = gltf.textures[0];
        material.unlit = true;
        let model = Model.from(gltf, {
            create: () => material
        });
        model.scale.set(1, Math.sqrt(2) / 2, 1);
        model.scale.set(.5, .5 * Math.sqrt(2) / 2, .7);
        model.alpha = 1.2;
        return model;
    }

    static resetUsed() {
        for (let index: number = 0; index < 28; index++) {
            DominoLogic.model.meshes[index].rotationQuaternion.setEulerAngles(90, 0, 0);
            DominoLogic.usedMeshes.set(DominoLogic.model.meshes[index], false);
        }
    }

    public static setUsed(mesh: Mesh3D, value: boolean = true): void {
        DominoLogic.usedMeshes.set(mesh, value);
        let usedCount: number = 0;
        DominoLogic.usedMeshes.forEach(value => {
            if (value) {
                usedCount++;
            }
        });
    }

    public static getUsed(mesh: Mesh3D): boolean {
        return DominoLogic.usedMeshes.get(mesh);
    }
}