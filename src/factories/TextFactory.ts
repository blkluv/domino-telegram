import {LINE_JOIN, Text} from "pixi.js";
import {Settings} from "../Settings";
import {CommissionerProps} from "./text_factory/CommissionerProps";


export class TextFactory {
    static createCommissioner(props: CommissionerProps): Text {
        let text: Text = new Text(
            props.value,
            {
                fontFamily: Settings.COMMISSIONER,
                strokeThickness: 0,
                fontSize: props.fontSize,
                fill: props.fill ?? 0xffffff,
                fontWeight: props.fontWeight ?? "800",
                align: props.align ?? "center",
                fontStyle: props.fontStyle ?? "normal"
            }
        );
        text.style.lineJoin = LINE_JOIN.ROUND;
        if (props.autoFitWidth && text.width > props.autoFitWidth) {
            text.scale.set(props.autoFitWidth / text.width);
        }
        return text;
    }

}