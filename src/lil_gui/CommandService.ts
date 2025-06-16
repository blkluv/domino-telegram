import {SitPlace} from "../dynamic_data/SitPlace";
import {GameConfig} from "@azur-games/pixi-vip-framework";
import {SocketService} from "../services/SocketService";
import {CommandObject} from "./command_service/CommandObject";


export class CommandService {
    private static commandObjects: CommandObject[] = [];

    static async init(): Promise<void> {
        CommandService.registerPlayerPieces();
        CommandService.registerPlayedPieces();
        CommandService.registerWin();
        CommandService.registerFail();
        CommandService.registerAddCoins();
        CommandService.registerAddExp();
        CommandService.registerChangeRole();
    }

    static async runCommand(commandName: string, ...args: any[]): Promise<string> {
        let commandObject: CommandObject = CommandService.commandObjects.find(commandObject => commandObject.commandName == commandName);
        if (!commandObject) {
            console.warn("command not found");
            return Promise.resolve("Command not found");
        }
        console.log("command:", commandName, args);
        let result: any = await commandObject.handler.apply(null, args);
        console.log("result:", result);
    }

    static registerCommand(commandName: string, handler: Function, doc: string = null) {
        this.commandObjects.push({commandName, handler, doc});
    }

    private static registerPlayedPieces() {
        CommandService.registerCommand(
            "playedPieces",
            (args: string[]) => {
                SocketService.gameConnection.send("playedPieces", args);
            },
            "playedPieces 12,23,34,45,56"
        );
    }

    private static registerPlayerPieces() {
        CommandService.registerCommand(
            "playerPieces",
            (args: string[]) => {
                SocketService.gameConnection.send("playerPieces", args);
            },
            "playerPieces left 00"
        );
    }

    static async fetchMacroses() {
        const resp = await fetch(GameConfig.backendURL + "/testMacrosConfig");
        return await resp.json();
    }

    private static registerSetCards() {
        CommandService.registerCommand(
            "setCards",
            async (playerPlace: SitPlace, ...cardCodes: string[]) => {
                await new Promise(resolve => {
                    SocketService.gameConnection.send("setGameCards", [playerPlace, ...cardCodes], resolve);
                });
            },
            "set cards (bots), usage: setCards left H7 H8 H9 H10 HK HQ HJ HA"
        );
    }

    private static registerSetContract() {
        CommandService.registerCommand(
            "setContract",
            async (playerPlace: SitPlace, trumpCode: string, value: number, multiplicator: number = 1) => {
                await new Promise(resolve => {
                    SocketService.gameConnection.send("setGameContract", [playerPlace, trumpCode, value, multiplicator], resolve);
                });
            },
            "set contract (bots), usage(belote): \"setContract left H\", usage(coinche): \"setContract left H 100 4\""
        );
    }

    private static registerAddScore() {
        CommandService.registerCommand("addGameScore", async (delta: number, enemy: boolean) => {
            await new Promise(resolve => {
                SocketService.gameConnection.send("addGameScore", [delta, enemy], resolve);
            });
        });
    }

    private static registerWin() {
        CommandService.registerCommand("winGame", async () => {
            await new Promise(resolve => {
                SocketService.gameConnection.send("winGame", [], resolve);
            });
        });
    }

    private static registerFail() {
        CommandService.registerCommand("failGame", async () => {
            await new Promise(resolve => {
                SocketService.gameConnection.send("failGame", [], resolve);
            });
        });
    }

    private static registerAddCoins() {
        CommandService.registerCommand("addCoins", async (coins: number) => {
            await new Promise(resolve => {
                SocketService.mainConnection.send("addCoins", [coins], resolve);
            });
        });
    }

    private static registerAddExp() {
        CommandService.registerCommand("addExp", async (coins: number) => {
            await new Promise(resolve => {
                SocketService.mainConnection.send("addExp", [coins], resolve);
            });
        });
    }

    private static registerChangeRole() {
        CommandService.registerCommand("changeRole", async (role: string, key: string) => {
            await new Promise(resolve => {
                SocketService.mainConnection.send("changeRole", [role, key], resolve);
            });
        });
    }
}