import {Button} from "@azur-games/pixi-vip-framework";


export class SettingsFooterLink extends Button {
    constructor(callback: Function, textKey: string) {
        super({callback, textKey, fontSize: 28, interactiveText: true, fontColor: 0xB79973});
        this.languageText.setTextStroke(0xE4CB97, 4);
    }
}