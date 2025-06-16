import GUI from "lil-gui";
import {GameConfig, Environment} from "@azur-games/pixi-vip-framework";
import {CommandService} from "./lil_gui/CommandService";
import {MacrosObject} from "./lil_gui/command_service/MacrosObject";
import {Player} from "./lil_gui/Player";
import {Popups} from "./lil_gui/Popups";
import {ServerCheats} from "./lil_gui/ServerCheats";


export class LilGui {
    private static gui: GUI;

    static async init(): Promise<void> {
        if (GameConfig.environment != Environment.DEV) {
            return;
        }
        CommandService.init();
        LilGui.gui = new GUI();
        Player.addToGui(LilGui.gui);
        // Game.addToGui(LilGui.gui);
        // Skins.addToGui(LilGui.gui);
        Popups.addToGui(LilGui.gui);
        ServerCheats.addToGui(LilGui.gui);
        LilGui.gui.close();

        let macroses: MacrosObject[] = await CommandService.fetchMacroses();
        let macrosGroups: Map<string, MacrosObject[]> = new Map<string, MacrosObject[]>();
        macroses.forEach(macros => {
            macrosGroups.has(macros.group) ? macrosGroups.get(macros.group).push(macros) : macrosGroups.set(macros.group, [macros]);
        });
        macrosGroups.forEach((macroses: MacrosObject[], macrosName: string) => {
            let folder: GUI = LilGui.gui.addFolder(macrosName);
            macroses.forEach(macros => {
                //console.log(macros.name);
                let macrosCommandObj = {};
                // @ts-ignore
                macrosCommandObj[macros.name] = async () => {
                    let command: string;
                    for (let coomandIndex: number = 0; coomandIndex < macros.commands.length; coomandIndex++) {
                        command = macros.commands[coomandIndex];
                        let commandName = command.split(" ")[0];
                        let commandArgs: string[] = command.split(commandName + " ")[1].split(" ");
                        await CommandService.runCommand(commandName, commandArgs);
                    }
                };
                folder.add(macrosCommandObj, macros.name as never);
            });
            folder.close();
        });
    }
}