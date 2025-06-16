import {Sprite} from "pixi.js";


export type DialogPopupData = {
    resolve: Function,
    titleText: string,
    prompt: Sprite,
    yesText: string,
    noText: string,
    okButtonOnly: boolean,
    closable?: boolean
}