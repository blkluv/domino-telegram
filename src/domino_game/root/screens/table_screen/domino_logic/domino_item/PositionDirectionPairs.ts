import {Direction} from "../Direction";
import {Position} from "../Position";
import {PositionDirectionPair} from "./PositionDirectionPair";


export class PositionDirectionPairs {
    static values: PositionDirectionPair[] = [
        {position: Position.CENTER, direction: Direction.UP},
        {position: Position.CENTER, direction: Direction.DOWN},
        {position: Position.TOP, direction: Direction.UP},
        {position: Position.TOP, direction: Direction.RIGHT},
        {position: Position.TOP, direction: Direction.DOWN},
        {position: Position.BOTTOM, direction: Direction.UP},
        {position: Position.BOTTOM, direction: Direction.LEFT},
        {position: Position.BOTTOM, direction: Direction.DOWN},
    ];
}