import {Graphics, Point, Sprite} from "pixi.js";
import {Stats} from "../../../../../../services/socket_service/socket_message_data/profile_data/Stats";
import {GameMode} from "../../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {DiagramCoords} from "./diagram/DiagramCoords";
import {DiagramType} from "./diagram/DiagramType";


export class Diagram extends Sprite {
    private polygon: Graphics;
    private fullPolygonCoords: DiagramCoords = new Map([
        [GameMode.CLASSIC, new Point(0, -162)],
        [GameMode.FUN, new Point(167, -49)],
        [GameMode.FIVES, new Point(104, 132)],
        [GameMode.BLOCK, new Point(-103, 131)],
        [GameMode.PRO, new Point(-167, -50)]
    ]);
    private currentPolygonCoords: DiagramCoords = new Map();

    constructor(private stats: Stats, private color: number = 0x0085FF, private borderColor: number = 0x87DBFF) {
        super();
        this.polygon = new Graphics();
        this.addChild(this.polygon);
    }

    update(type: DiagramType, opponentStats: Stats): void {
        type == DiagramType.GAMES_PLAYED ? this.createGamesPlayedCoords(opponentStats) : this.createWinRateCoords();
        this.polygon.clear()
            .lineStyle({width: 2, color: this.borderColor, alignment: 0, alpha: 1})
            .beginFill(this.color, .5)
            .drawPolygon([
                this.currentPolygonCoords.get(GameMode.CLASSIC),
                this.currentPolygonCoords.get(GameMode.FUN),
                this.currentPolygonCoords.get(GameMode.FIVES),
                this.currentPolygonCoords.get(GameMode.BLOCK),
                this.currentPolygonCoords.get(GameMode.PRO)
            ])
            .endFill();
    }

    setCurrentCoord(percent: number, gameMode: GameMode): void {
        percent = Math.max(percent, 10);
        this.currentPolygonCoords.set(gameMode, new Point(
            this.fullPolygonCoords.get(gameMode).x / 100 * percent,
            this.fullPolygonCoords.get(gameMode).y / 100 * percent
        ));
    }

    createGamesPlayedCoords(opponentStats: Stats): void {
        let biggestGameCount: number = 0;
        let gameMode: GameMode;

        for (gameMode in this.stats.statByGame) {
            let gameCount: number = this.stats.statByGame[gameMode].gameCount;
            gameCount > biggestGameCount && (biggestGameCount = gameCount);
        }
        if (opponentStats) {
            for (gameMode in opponentStats.statByGame) {
                let gameCount: number = opponentStats.statByGame[gameMode].gameCount;
                gameCount > biggestGameCount && (biggestGameCount = gameCount);
            }
        }
        for (gameMode in this.stats.statByGame) {
            let ratio: number = biggestGameCount ? this.stats.statByGame[gameMode].gameCount / biggestGameCount : 0;
            this.setCurrentCoord(ratio * 100, gameMode);
        }
    }

    createWinRateCoords(): void {
        let biggestWinRate: number = 100;
        let gameMode: GameMode;

        for (gameMode in this.stats.statByGame) {
            let winRate: number = this.calcWinRate(gameMode);
            winRate > biggestWinRate && (biggestWinRate = winRate);
        }
        for (gameMode in this.stats.statByGame) {
            let ratio: number = biggestWinRate ? this.calcWinRate(gameMode) / biggestWinRate : 0;
            this.setCurrentCoord(ratio * 100, gameMode);
        }
    }

    calcWinRate(gameMode: GameMode): number {
        let gameCount: number = this.stats.statByGame[gameMode].gameCount;
        let wonGameCount: number = this.stats.statByGame[gameMode].wonGameCount;
        return gameCount ? Math.trunc(wonGameCount / gameCount * 100) : 0;
    }

    destroy(): void {
        this.fullPolygonCoords.clear();
        this.currentPolygonCoords.clear();
        this.fullPolygonCoords = null;
        this.currentPolygonCoords = null;

        this.removeChild(this.polygon);
        this.polygon.destroy();
        this.polygon = null;
        super.destroy();
    }
}
