import {Point, Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {Button} from "../../../../../../pixi-vip-framework";
import {DynamicData} from "../../../../DynamicData";
import {GameEvents} from "../../../../GameEvents";
import {AvatarService} from "../../../../services/AvatarService";
import {LobbyHeaderAvatar} from "./lobby_header/LobbyHeaderAvatar";
import {LobbyHeaderBalance} from "./lobby_header/LobbyHeaderBalance";
import {DominoGame} from "../../../../app";


export class LobbyHeader extends Sprite {
    private avatar: LobbyHeaderAvatar;
    private playerName: LanguageText;
    private balance: LobbyHeaderBalance;
    private depositButton: Button;
    private withdrawButton: Button;
    private historyButton: Button;
    private onProfileUpdatedBindThis: (e: Event) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.resize();
        this.onProfileUpdated();
        this.onProfileUpdatedBindThis = this.onProfileUpdated.bind(this);
        addEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
    }

    createChildren(): void {
        this.avatar = new LobbyHeaderAvatar();
        this.playerName = new LanguageText({key: "", fontSize: 32, fontWeight: "500", fill: 0xDAEDFF});
        this.balance = new LobbyHeaderBalance();
        this.depositButton = new Button({
            callback: this.onDepositClick.bind(this),
            bgTextureName: "lobby/round_green_button",
            iconTextureName: "lobby/deposit_icon",
            iconPosition: new Point(0, -3),
            textKey: "Deposit",
            fontSize: 32,
            fontWeight: "400",
            fontColor: 0x7BA2FF,
            textPosition: new Point(0, 85)
        });
        this.withdrawButton = new Button({
            callback: this.onWithdrawClick.bind(this),
            bgTextureName: "lobby/round_green_button",
            iconTextureName: "lobby/withdraw_icon",
            iconPosition: new Point(0, -3),
            textKey: "Withdraw",
            fontSize: 32,
            fontWeight: "400",
            fontColor: 0x7BA2FF,
            textPosition: new Point(0, 85)
        });
        this.historyButton = new Button({
            callback: this.onHistoryClick.bind(this),
            bgTextureName: "lobby/round_green_button",
            iconTextureName: "lobby/history_icon",
            iconPosition: new Point(0, -3),
            textKey: "History",
            fontSize: 32,
            fontWeight: "400",
            fontColor: 0x7BA2FF,
            textPosition: new Point(0, 85)
        });
    }

    addChildren(): void {
        this.addChild(this.avatar);
        this.addChild(this.playerName);
        this.addChild(this.balance);
        this.addChild(this.depositButton);
        this.addChild(this.withdrawButton);
        this.addChild(this.historyButton);
    }

    resize(): void {
        this.y = -DominoGame.instance.screenH / 2;
        this.avatar.y = 200;
        this.avatar.x = DominoGame.instance.screenW / 2 - 175;
        this.playerName.y = 120;
        this.balance.y = 180;
        this.balance.x = this.playerName.x = -DominoGame.instance.screenW / 2 + 95;

        this.depositButton.y = this.withdrawButton.y = this.historyButton.y = 400;
        this.depositButton.x = -300;
        this.historyButton.x = 300;
    }

    onProfileUpdated(): void {
        this.playerName.text = DynamicData.myProfile.name;
        this.avatar.setAvatar(AvatarService.getAvatarTextureNameByProfile(DynamicData.myProfile));
        this.balance.setBalance(DynamicData.myProfile.coins);
    }

    onDepositClick(): void {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_DEPOSIT_POPUP));
    }

    onWithdrawClick(): void {
        console.log("withdraw clicked");
    }

    onHistoryClick(): void {
        console.log("history clicked");
    }

    destroy(): void {
        removeEventListener(GameEvents.PROFILE_UPDATED, this.onProfileUpdatedBindThis);
        this.onProfileUpdatedBindThis = null;

        this.removeChild(this.avatar);
        this.removeChild(this.playerName);
        this.removeChild(this.balance);
        this.removeChild(this.depositButton);
        this.removeChild(this.withdrawButton);
        this.removeChild(this.historyButton);

        this.avatar.destroy();
        this.playerName.destroy();
        this.balance.destroy();
        this.depositButton.destroy();
        this.withdrawButton.destroy();
        this.historyButton.destroy();

        this.avatar = null;
        this.playerName = null;
        this.balance = null;
        this.depositButton = null;
        this.withdrawButton = null;
        this.historyButton = null;

        super.destroy();
    }
}
