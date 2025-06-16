import {Sprite} from "pixi.js";
import {DynamicData} from "../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {ProfileData} from "../../../../../services/socket_service/socket_message_data/ProfileData";
import {GameMode} from "../../../../../services/socket_service/socket_message_data/socket_game_config/GameMode";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {Diagram} from "./statistics_page/Diagram";
import {DiagramType} from "./statistics_page/diagram/DiagramType";
import {DiagramLegendItem} from "./statistics_page/DiagramLegendItem";
import {DiagramPointsItem} from "./statistics_page/DiagramPointsItem";
import {DiagramToggle} from "./statistics_page/DiagramToggle";


export class StatisticsPage extends Sprite {
    private diagramBackground: Sprite;
    private myDiagram: Diagram;
    private opponentDiagram: Diagram;
    private pointsItems: Map<GameMode, DiagramPointsItem> = new Map();
    private toggle: DiagramToggle;
    private youLegend: DiagramLegendItem;
    private opponentLegend: DiagramLegendItem;
    private diagramType: DiagramType = DiagramType.GAMES_PLAYED;

    constructor(private profileData: ProfileData) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.update();
    }

    createChildren(): void {
        this.diagramBackground = DisplayObjectFactory.createSprite("profile/radar_chart");
        this.myDiagram = new Diagram(DynamicData.myProfile.stats);
        this.opponentDiagram = new Diagram(this.profileData.stats, 0xAD00FF, 0xE18DFF);
        this.pointsItems.set(GameMode.CLASSIC, new DiagramPointsItem("Profile/Statistics/Classic"));
        this.pointsItems.set(GameMode.FUN, new DiagramPointsItem("Profile/Statistics/FunMode"));
        this.pointsItems.set(GameMode.FIVES, new DiagramPointsItem("Profile/Statistics/Fives"));
        this.pointsItems.set(GameMode.BLOCK, new DiagramPointsItem("Profile/Statistics/Block"));
        this.pointsItems.set(GameMode.PRO, new DiagramPointsItem("Profile/Statistics/ProMode"));
        this.toggle = new DiagramToggle(this.onToggle.bind(this));
        this.youLegend = new DiagramLegendItem();
        this.opponentLegend = new DiagramLegendItem(this.profileData.name, "profile/legend_violette");
    }

    addChildren(): void {
        this.addChild(this.diagramBackground);
        this.addChild(this.myDiagram);
        this.addChild(this.opponentDiagram).visible = this.profileData.id != DynamicData.myProfile.id;
        this.pointsItems.forEach(item => this.addChild(item));
        this.addChild(this.toggle);
        this.addChild(this.youLegend).visible = this.profileData.id != DynamicData.myProfile.id;
        this.addChild(this.opponentLegend).visible = this.profileData.id != DynamicData.myProfile.id;
    }

    onToggle(toggled: boolean): void {
        this.diagramType = toggled ? DiagramType.GAMES_PLAYED : DiagramType.WIN_RATE;
        this.update();
    }

    update(): void {
        this.myDiagram.update(this.diagramType, this.profileData.stats);
        this.opponentDiagram.update(this.diagramType, DynamicData.myProfile.stats);
        this.pointsItems.forEach((item: DiagramPointsItem, gameMode: GameMode): void => {
            item.update(this.profileData.stats.statByGame[gameMode], this.diagramType);
        });
    }

    initChildren(): void {
        Pivot.center(this.diagramBackground);

        this.pointsItems.get(GameMode.CLASSIC).y = -195;
        this.pointsItems.get(GameMode.FUN).x = 260;
        this.pointsItems.get(GameMode.FUN).y = -40;
        this.pointsItems.get(GameMode.FIVES).x = 200;
        this.pointsItems.get(GameMode.FIVES).y = 160;
        this.pointsItems.get(GameMode.BLOCK).x = -200;
        this.pointsItems.get(GameMode.BLOCK).y = 160;
        this.pointsItems.get(GameMode.PRO).x = -260;
        this.pointsItems.get(GameMode.PRO).y = -40;

        this.diagramBackground.y = -3;
        this.toggle.x = 340;
        this.toggle.y = 255;
        this.youLegend.y = this.opponentLegend.y = 255;
        this.youLegend.x = -370;
        this.opponentLegend.x = -200;
    }

    destroy(): void {
        let pointsItem: DiagramPointsItem;
        this.pointsItems.forEach(item => {
            pointsItem = item;
            this.removeChild(pointsItem);
            pointsItem.destroy();
        });
        this.pointsItems = null;

        this.removeChild(this.diagramBackground);
        this.removeChild(this.opponentDiagram);
        this.removeChild(this.myDiagram);
        this.removeChild(this.toggle);
        this.removeChild(this.youLegend);
        this.removeChild(this.opponentLegend);

        this.diagramBackground.destroy();
        this.opponentDiagram.destroy();
        this.myDiagram.destroy();
        this.toggle.destroy();
        this.youLegend.destroy();
        this.opponentLegend.destroy();

        this.diagramBackground = null;
        this.opponentDiagram = null;
        this.myDiagram = null;
        this.toggle = null;
        this.youLegend = null;
        this.opponentLegend = null;
        this.diagramType = null;

        super.destroy();
    }
}
