import {NineSlicePlane, Sprite} from "pixi.js";
import {LanguageText} from "@azur-games/pixi-vip-framework";
import {DynamicData} from "../../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../../GameEvents";
import {LanguageService} from "@azur-games/pixi-vip-framework";
import {PlatformService} from "@azur-games/pixi-vip-framework";
import {SocketService} from "../../../../../../services/SocketService";
import {Settings} from "../../../../../../Settings";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {SettingsFooterLink} from "./settings_footer/SettingsFooterLink";
import {SettingsFooterRow} from "./settings_footer/SettingsFooterRow";


export class SettingsFooter extends Sprite {
    private background: NineSlicePlane;
    private firstRow: SettingsFooterRow;
    private secondRow: SettingsFooterRow;
    private placeLinksBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.placeLinks();

        this.placeLinksBindThis = this.placeLinks.bind(this);
        addEventListener(GameEvents.LANGUAGE_CHANGED, this.placeLinksBindThis);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("settings/footer_bg", 23, 32, 23, 32);
        this.firstRow = new SettingsFooterRow([
            new SettingsFooterLink(this.onSiteClick.bind(this), "Settings/Site"),
            new SettingsFooterLink(this.onConsentSettingsClick.bind(this), "Settings/ConsentSettings"),
            new SettingsFooterLink(this.onDeleteAccountClick.bind(this), "Settings/DeleteAccount")
        ]);
        this.secondRow = new SettingsFooterRow([
            new SettingsFooterLink(this.onPrivacyPolicyClick.bind(this), "Settings/PrivacyPolicy"),
            new SettingsFooterLink(this.onHelpClick.bind(this), "Settings/Help"),
        ]);
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.firstRow).visible = PlatformService.platformApi.settingsLinksBlockVisible;
        this.addChild(this.secondRow).visible = PlatformService.platformApi.settingsLinksBlockVisible;
    }

    initChildren(): void {
        this.background.width = 1142;
        Pivot.center(this.background);
        this.firstRow.y = -20;
        this.secondRow.y = 15;
    }

    placeLinks(): void {
        this.firstRow.placeLinks();
        this.secondRow.placeLinks();
    }

    onSiteClick(): void {
        window.open("https://azurgames.com/", "_blank");
    }

    onConsentSettingsClick(): void {
        window.open("https://azurgames.com/cookie-policy/", "_blank");
    }

    async onDeleteAccountClick(): Promise<void> {
        let prompt: LanguageText = new LanguageText({key: "DialogWindow/delete-account/message", fontSize: 40, fill: 0x8f6942, autoFitWidth: 740, placeholders: [Settings.DESTROY_DAYS.toString()]});
        prompt.setTextStroke(0xFFEBD180, 4);
        let deleteConfirmed: boolean = await new Promise(resolve => dispatchEvent(new MessageEvent(GameEvents.OPEN_DIALOG_POPUP, {
            data: {
                resolve,
                titleText: LanguageService.getTextByKey("DialogWindow/delete-account/title").toUpperCase(),
                prompt,
                yesText: LanguageService.getTextByKey("DialogWindow/delete-account/ACCEPT"),
                noText: LanguageService.getTextByKey("DialogWindow/delete-account/REJECT"),

            }
        })));
        deleteConfirmed && await SocketService.deleteAccount(Settings.DESTROY_MSEC);
    };

    onPrivacyPolicyClick(): void {
        window.open(" https://azurgames.com/privacy-policy/", "_blank");
    }

    onHelpClick(): void {
        // let id: string = BeloteGame.apiType + "." + DynamicData.myProfile.id + "." + AuthService.authUser.testGroup + " v" + window.gameBundleVersion;
        let id: string = DynamicData.myProfile.id.toString();
        const url: string = "mailto:support+domino@azurgames.com"
            + "?subject=" + encodeURIComponent(LanguageService.getTextByKey("message-to-support.subject", [id]))
            + "&body=" + encodeURIComponent(LanguageService.getTextByKey("message-to-support.body", [id]));
        window.open(url);
    }

    destroy(): void {
        removeEventListener(GameEvents.LANGUAGE_CHANGED, this.placeLinksBindThis);
        this.placeLinksBindThis = null;

        this.removeChild(this.background);
        this.removeChild(this.firstRow);
        this.removeChild(this.secondRow);

        this.background.destroy();
        this.firstRow.destroy();
        this.secondRow.destroy();

        this.background = null;
        this.firstRow = null;
        this.secondRow = null;

        super.destroy();
    }
}
