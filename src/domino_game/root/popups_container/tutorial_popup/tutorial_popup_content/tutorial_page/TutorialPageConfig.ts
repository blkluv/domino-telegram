import {Point, Sprite} from "pixi.js";


export type TutorialPageConfig = {
    imageName: string,
    elements?: TutorialPageElementsConfig[]
}

export type TutorialPageElementsConfig = {
    element: Sprite,
    position: Point
}