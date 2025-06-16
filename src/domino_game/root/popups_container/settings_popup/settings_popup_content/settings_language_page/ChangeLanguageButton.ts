import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../GameEvents";
import {Language} from "@azur-games/pixi-vip-framework";
import {SettingsService} from "../../../../../../services/SettingsService";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class ChangeLanguageButton extends Sprite {
    private bottomLayer: NineSlicePlane;
    private button: Button;
    private checkLanguageBindThis: (e: MessageEvent) => void;

    constructor(private callback: Function, private textKey: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.checkLanguage();
        this.checkLanguageBindThis = this.checkLanguage.bind(this);
        addEventListener(GameEvents.LANGUAGE_CHANGED, this.checkLanguageBindThis);
    }

    createChildren(): void {
        this.button = new Button({
            callback: this.callback,
            textKey: this.textKey,
            bgTextureName: "common/ButtonLightBlue",
            bgSizes: new Point(400, 94),
            bgCornersSize: 52,
            fontSize: 44,
            textPosition: new Point(0, -3),
        });
        this.bottomLayer = DisplayObjectFactory.createNineSlicePlane("settings/button_bottom_layer", 98, 98, 98, 98);
    }

    addChildren(): void {
        this.addChild(this.bottomLayer);
        this.addChild(this.button);
    }

    initChildren(): void {
        this.button.languageText.setTextShadow();
        this.bottomLayer.width = 437;
        this.bottomLayer.height = 130;
        Pivot.center(this.bottomLayer);
    }

    checkLanguage(): void {
        let language: Language = this.textKey.replace("SettingsWindow/language/", "") as Language;
        this.button.setBackgroundCorners(language == SettingsService.currentLanguage ? 60 : 52);
        this.button.changeBackgroundImage(language == SettingsService.currentLanguage ? "common/ButtonViolet" : "common/ButtonLightBlue");
    }

    destroy(): void {
        removeEventListener(GameEvents.LANGUAGE_CHANGED, this.checkLanguageBindThis);
        this.checkLanguageBindThis = null;

        this.removeChild(this.bottomLayer);
        this.removeChild(this.button);

        this.bottomLayer.destroy();
        this.button.destroy();

        this.bottomLayer = null;
        this.button = null;

        super.destroy();
    }
}