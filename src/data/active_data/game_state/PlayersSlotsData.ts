import {IPlayersSlotsData} from "../../../dynamic_data/ISocketGameState";
import {BaseData} from '../base/static_config_data/BaseData';
import {RoundUserData} from "./players_data/RoundUserData";


export class PlayersSlotsData extends BaseData {
    top: RoundUserData;
    left: RoundUserData;
    right: RoundUserData;
    bottom: RoundUserData;

    constructor(private config: IPlayersSlotsData) {
        super();

        this.top = new RoundUserData(this.config.top);
        this.left = new RoundUserData(this.config.left);
        this.right = new RoundUserData(this.config.right);
        this.bottom = new RoundUserData(this.config.bottom);
    }

    asArray() {
        return [this.top, this.left, this.right, this.bottom];
    }
}
