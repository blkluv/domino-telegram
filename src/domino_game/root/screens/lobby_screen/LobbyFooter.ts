import {Sprite} from "pixi.js";
import {DominoGame} from "../../../../app";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../GameEvents";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {LobbyFooterButton} from "./lobby_footer/LobbyFooterButton";
import {WheelButton} from "./WheelButton";


export class LobbyFooter extends Sprite {
    background: Sprite;
    private leftBush: Sprite;
    private rightBush: Sprite;
    private buttonsMargin: number = 300;
    private privateLobbyButton: LobbyFooterButton;
    private skinsButton: LobbyFooterButton;
    private wheelButton: WheelButton;
    private vipButton: LobbyFooterButton;
    private tournamentButton: LobbyFooterButton;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    getItems(): Sprite[] {
        return [this.privateLobbyButton, this.skinsButton, this.wheelButton, this.vipButton, this.tournamentButton];
    }

    getBushes(): Sprite[] {
        return [this.leftBush, this.rightBush];
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createSprite("lobby/plate_menu");
        this.leftBush = DisplayObjectFactory.createSprite("lobby/bush");
        this.rightBush = DisplayObjectFactory.createSprite("lobby/bush");
        this.privateLobbyButton = new LobbyFooterButton(
            this.onPrivateLobbyClick.bind(this),
            "lobby/lock",
            "Lobby/PrivateLobby",
        );
        this.skinsButton = new LobbyFooterButton(
            this.onSkinsClick.bind(this),
            "lobby/domino",
            "Lobby/Skins",
        );
        this.wheelButton = new WheelButton(this.onWheelClick.bind(this));
        this.vipButton = new LobbyFooterButton(
            this.onVipClick.bind(this),
            "lobby/crown",
            "Lobby/VIP"
        );
        this.tournamentButton = new LobbyFooterButton(
            this.onTournamentClick.bind(this),
            "lobby/tournament",
            "Lobby/Tournament"
        );
    }

    addChildren(): void {
        this.addChild(this.leftBush);
        this.addChild(this.rightBush);
        this.addChild(this.background);
        this.addChild(this.privateLobbyButton).visible = false;
        this.addChild(this.skinsButton).visible = false;
        this.addChild(this.wheelButton);
        this.addChild(this.vipButton).visible = false;
        this.addChild(this.tournamentButton).visible = false;
    }

    initChildren(): void {
        Pivot.center(this.background);

        this.wheelButton.x = -7;
        this.wheelButton.y = 58;
        this.privateLobbyButton.x = -this.buttonsMargin * 2;
        this.skinsButton.x = -this.buttonsMargin;
        this.vipButton.x = this.buttonsMargin;
        this.tournamentButton.x = this.buttonsMargin * 2;
        this.privateLobbyButton.y = this.skinsButton.y = this.vipButton.y = this.tournamentButton.y = 4;
    }

    onGameScaleChanged(): void {
        this.y = DominoGame.instance.screenH / 2 - this.background.height / 2;

        this.rightBush.y = this.leftBush.y = -this.leftBush.height / 2;
        this.leftBush.x = -DominoGame.instance.screenW / 2;
        this.rightBush.x = -this.leftBush.x;
        this.rightBush.scale.x = -1;
    }

    onPrivateLobbyClick(): void {
        console.log("private lobby");
    }

    onSkinsClick(): void {
        console.log("skins");
    }

    onWheelClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_WHEEL_POPUP));
    }

    onVipClick(): void {
        console.log("vip clicked");
    }

    onTournamentClick(): void {
        console.log("tournament clicked");
    }

    destroy(): void {
        this.removeChild(this.leftBush);
        this.removeChild(this.rightBush);
        this.removeChild(this.background);
        this.removeChild(this.privateLobbyButton);
        this.removeChild(this.skinsButton);
        this.removeChild(this.wheelButton);
        this.removeChild(this.vipButton);
        this.removeChild(this.tournamentButton);

        this.leftBush.destroy();
        this.rightBush.destroy();
        this.background.destroy();
        this.privateLobbyButton.destroy();
        this.skinsButton.destroy();
        this.wheelButton.destroy();
        this.vipButton.destroy();
        this.tournamentButton.destroy();

        this.leftBush = null;
        this.background = null;
        this.rightBush = null;
        this.privateLobbyButton = null;
        this.skinsButton = null;
        this.wheelButton = null;
        this.vipButton = null;
        this.tournamentButton = null;

        super.destroy();
    }
}
