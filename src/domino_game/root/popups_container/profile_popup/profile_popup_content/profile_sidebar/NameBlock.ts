import {NineSlicePlane, Sprite} from "pixi.js";
import {Button} from "@azur-games/pixi-vip-framework";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../GameEvents";
import {PlatformService} from "@azur-games/pixi-vip-framework";
import {ProfileData} from "../../../../../../services/socket_service/socket_message_data/ProfileData";
import {Pivot} from "@azur-games/pixi-vip-framework";


export class NameBlock extends Sprite {
    private background: NineSlicePlane;
    private nameText: LanguageText;
    private editNameButton: Button;

    constructor(private profileData: ProfileData) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren() {
        this.background = DisplayObjectFactory.createNineSlicePlane("profile/name_bg", 5, 5, 5, 5);
        this.nameText = new LanguageText({key: this.profileData.name, fontSize: 40, autoFitWidth: 300});
        this.editNameButton = new Button({callback: this.onEditNameClick.bind(this), bgTextureName: "profile/name_edit"});
    }

    addChildren() {
        this.addChild(this.background);
        this.addChild(this.nameText);
        this.addChild(this.editNameButton).visible = this.profileData.id == DynamicData.myProfile.id && PlatformService.platformApi.myPlayerNameEditable;
    }

    initChildren() {
        this.background.width = 478;
        this.background.height = 80;

        Pivot.center(this.background);
        Pivot.center(this.nameText);

        this.editNameButton.x = -190;
        this.editNameButton.y = 7;
    }

    onEditNameClick() {
        dispatchEvent(new MessageEvent(GameEvents.OPEN_EDIT_PROFILE_POPUP));
    }

    update(value: string) {
        this.nameText.changeText(value, false);
        this.nameText.fitWidth();
        Pivot.center(this.nameText);
    }

    destroy() {
        this.removeChild(this.background);
        this.removeChild(this.nameText);
        this.removeChild(this.editNameButton);

        this.background.destroy();
        this.nameText.destroy();
        this.editNameButton.destroy();

        this.background = null;
        this.nameText = null;
        this.editNameButton = null;

        super.destroy();
    }
}