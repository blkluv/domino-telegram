import {QuestName} from "./quest_config/QuestName";
import {QuestObjectiveStatus} from "./quest_config/QuestObjectiveStatus";
import {QuestState} from "./quest_config/QuestState";


export type QuestConfig = {
    name: QuestName,
    objectives: {[key: string]: QuestObjectiveStatus},
    reward: {coins: number},
    tags: string[],
    state: QuestState
}