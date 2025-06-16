import {Sprite, Text} from "pixi.js";
import {Player} from "../../../../../common/Player";
import {IRoundUser} from "../../../../../dynamic_data/IRoundUser";
import {DynamicData} from "../../../../../DynamicData";
import {TextFactory} from "../../../../../factories/TextFactory";
import {GameEvents} from "../../../../../GameEvents";
import {PlayerData} from "../../../../../services/socket_service/socket_message_data/profile_data/PlayerData";
import {ProfileData} from "../../../../../services/socket_service/socket_message_data/ProfileData";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {PlayerScore} from "./end_game_player/PlayerScore";
import {WinnerGlow} from "./end_game_player/WinnerGlow";


export class EndGamePlayer extends Sprite {
    winnerGlow: WinnerGlow;
    player: Player;
    nameText: Text;
    score: PlayerScore;
    private playerData: PlayerData;

    constructor(private my: boolean, private won: boolean) {
        super();

        this.createChildren();
        this.addChildren();
        this.initChildren();

        this.applyData(DynamicData.socketGameRequest.queue.find(player => this.my == (player.id == DynamicData.myProfile.id)));
    }

    destroy() {
        this.removeChild(this.winnerGlow);
        this.removeChild(this.player);
        this.removeChild(this.nameText);
        this.removeChild(this.score);

        this.winnerGlow?.destroy();
        this.player.destroy();
        this.nameText.destroy();
        this.score.destroy();

        this.winnerGlow = undefined;
        this.player = undefined;
        this.nameText = undefined;
        this.score = undefined;

        super.destroy();
    }

    applyData(iRoundUser: IRoundUser) {
        this.playerData = this.my ? DynamicData.myProfile : iRoundUser;
        this.player.applyData(this.playerData);
        this.nameText.text = iRoundUser.name;
        Pivot.center(this.nameText);
        this.nameText.y = -50;
        this.nameText.x = (this.nameText.width / 2 + 135) * (this.my ? -1 : 1);
    }

    private createChildren() {
        if (this.won) {
            this.winnerGlow = new WinnerGlow();
        }
        this.player = new Player({callback: this.onPlayerClick.bind(this), showLevel: true});
        this.nameText = TextFactory.createCommissioner({fontSize: 36});
        this.score = new PlayerScore();
    }

    private async onPlayerClick() {
        let profileData: ProfileData = await DynamicData.profiles.getFullProfileById(this.playerData.id);
        dispatchEvent(new MessageEvent(GameEvents.OPEN_PROFILE_POPUP, {data: {profileData}}));
    }

    private addChildren() {
        this.winnerGlow && this.addChild(this.winnerGlow);
        this.addChild(this.player);
        this.addChild(this.nameText);
        this.addChild(this.score);
    }

    private initChildren() {
        this.player.scale.set(1.5);
        this.score.y = 20;
        this.score.x = 230 * (this.my ? -1 : 1);

        this.score.setValue(this.my ? DynamicData.socketGameRequest.myScore : DynamicData.socketGameRequest.otherScore);
    }
}