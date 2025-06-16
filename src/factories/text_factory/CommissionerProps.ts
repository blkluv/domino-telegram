import {TextStyleAlign, TextStyleFill, TextStyleFontStyle, TextStyleFontWeight} from "pixi.js";


export type CommissionerProps = {
    value?: string,
    fontSize: number,
    fill?: TextStyleFill,
    align?: TextStyleAlign,
    fontWeight?: TextStyleFontWeight,
    autoFitWidth?: number,
    fontStyle?: TextStyleFontStyle
}