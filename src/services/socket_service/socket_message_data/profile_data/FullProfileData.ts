import {PvpStats} from "./PvpStats";
import {ProfileData} from "../ProfileData";


export interface FullProfileData extends ProfileData {
    pvpStat?: PvpStats;
}