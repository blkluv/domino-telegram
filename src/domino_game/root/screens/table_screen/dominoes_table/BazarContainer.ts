import {ALPHA_MODES, NineSlicePlane, RenderTexture} from "pixi.js";
import {Mesh3D, Sprite3D, StandardMaterial, StandardMaterialAlphaMode} from "pixi3d";
import {DominoGame} from "../../../../../app";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework"


import {Pivot} from "@azur-games/pixi-vip-framework"
import {Settings3D} from "../../../../../utils/Settings3D";


export class BazarContainer extends Sprite3D {
    static bazarBackTexture: RenderTexture = RenderTexture.create({width: 1000, height: 1000, alphaMode: ALPHA_MODES.PREMULTIPLY_ALPHA});
    private vignette: NineSlicePlane;
    private back: Mesh3D;

    constructor() {
        super();

        this.vignette = DisplayObjectFactory.createNineSlicePlane("table/black4", 1, 1, 1, 1);

        let material = new StandardMaterial();
        material.baseColorTexture = BazarContainer.bazarBackTexture;
        material.unlit = true;
        material.doubleSided = true;
        material.alphaCutoff = .9;
        material.alphaMode = StandardMaterialAlphaMode.mask;
        this.back = Mesh3D.createPlane(material);
        this.back.scale.set(15, 15, 15);
        this.back.rotationQuaternion.setEulerAngles(90 + Settings3D.corner, 0, 0);
        this.addChild(this.vignette).alpha = .8;
        this.addChild(this.back);
    }

    async show(value: boolean) {
        this.visible = value;
    }

    destroy() {
        this.removeChild(this.vignette);
        this.removeChild(this.back);

        this.back.destroy();
        this.vignette.destroy();

        this.back = undefined;
        this.vignette = undefined;

        super.destroy();
    }

    resize() {
        this.vignette.width = DominoGame.instance.width + 4;
        this.vignette.height = DominoGame.instance.height + 4;
        this.vignette.x = DominoGame.instance.width / 2;
        this.vignette.y = DominoGame.instance.height / 2;
        Pivot.center(this.vignette);
    }
}