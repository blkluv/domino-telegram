import {Sprite} from "pixi.js";
import {GameEvents} from "../../GameEvents";
import {ProfileData} from "../../services/socket_service/socket_message_data/ProfileData";
import {ChatEventMessage} from "../../services/socket_service/socket_message_data/user_events_message/ChatEventMessage";
import {LevelUpEventMessage} from "../../services/socket_service/socket_message_data/user_events_message/LevelUpEventMessage";
import {DialogPopupData} from "./popups_container/dialog_popup/DialogPopupData";
import {DialogPopup} from "./popups_container/DialogPopup";
import {EditProfilePopup} from "./popups_container/EditProfilePopup";
import {FriendsPopup} from "./popups_container/FriendsPopup";
import {InfoPopupData} from "./popups_container/info_popup/InfoPopupData";
import {InfoPopup} from "./popups_container/InfoPopup";
import {InputPopupData} from "./popups_container/input_popup/InputPopupData";
import {InputPopup} from "./popups_container/InputPopup";
import {LeaveGamePopup} from "./popups_container/LeaveGamePopup";
import {LevelUpPopup} from "./popups_container/LevelUpPopup";
import {MaintenancePopup} from "./popups_container/MaintenancePopup";
import {MessagesPopup} from "./popups_container/MessagesPopup";
import {ProfilePopup} from "./popups_container/ProfilePopup";
import {SettingsPopup} from "./popups_container/SettingsPopup";
import {StorePopup} from "./popups_container/StorePopup";
import {TutorialPopup} from "./popups_container/TutorialPopup";
import {WheelPopup} from "./popups_container/WheelPopup";
import {DepositPopup} from "./popups_container/DepositPopup";


export class PopupsContainer extends Sprite {
    private profilePopup: ProfilePopup;
    private editProfilePopup: EditProfilePopup;
    private settingsPopup: SettingsPopup;
    private friendsPopup: FriendsPopup;
    private wheelPopup: WheelPopup;
    private messagesPopup: MessagesPopup;
    private storePopup: StorePopup;
    private dialogPopup: DialogPopup;
    private leaveGamePopup: LeaveGamePopup;
    private levelUpPopup: LevelUpPopup;
    private tutorialPopup: TutorialPopup;
    private infoPopup: InfoPopup;
    private inputPopup: InputPopup;
    private maintenancePopup: MaintenancePopup;
    private depositPopup: DepositPopup;

    constructor() {
        super();
        addEventListener(GameEvents.OPEN_PROFILE_POPUP, this.onOpenProfilePopup.bind(this));
        addEventListener(GameEvents.CLOSE_PROFILE_POPUP, this.onCloseProfilePopup.bind(this));
        addEventListener(GameEvents.OPEN_EDIT_PROFILE_POPUP, this.onOpenEditProfilePopup.bind(this));
        addEventListener(GameEvents.CLOSE_EDIT_PROFILE_POPUP, this.onCloseEditProfilePopup.bind(this));
        addEventListener(GameEvents.OPEN_SETTINGS_POPUP, this.onOpenSettingsPopup.bind(this));
        addEventListener(GameEvents.CLOSE_SETTINGS_POPUP, this.onCloseSettingsPopup.bind(this));
        addEventListener(GameEvents.OPEN_FRIENDS_POPUP, this.onOpenFriendsPopup.bind(this));
        addEventListener(GameEvents.CLOSE_FRIENDS_POPUP, this.onCloseFriendsPopup.bind(this));
        addEventListener(GameEvents.OPEN_WHEEL_POPUP, this.onOpenWheelPopup.bind(this));
        addEventListener(GameEvents.CLOSE_WHEEL_POPUP, this.onCloseWheelPopup.bind(this));
        addEventListener(GameEvents.OPEN_MESSAGES_POPUP, this.onOpenMessagesPopup.bind(this));
        addEventListener(GameEvents.CLOSE_MESSAGES_POPUP, this.onCloseMessagesPopup.bind(this));
        addEventListener(GameEvents.OPEN_STORE_POPUP, this.onOpenStorePopup.bind(this));
        addEventListener(GameEvents.CLOSE_STORE_POPUP, this.onCloseStorePopup.bind(this));
        addEventListener(GameEvents.OPEN_DIALOG_POPUP, this.onOpenDialogPopup.bind(this));
        addEventListener(GameEvents.CLOSE_DIALOG_POPUP, this.onCloseDialogPopup.bind(this));
        addEventListener(GameEvents.OPEN_LEAVE_GAME_POPUP, this.onOpenLeaveGamePopup.bind(this));
        addEventListener(GameEvents.CLOSE_LEAVE_GAME_POPUP, this.onCloseLeaveGamePopup.bind(this));
        addEventListener(GameEvents.OPEN_LEVEL_UP_POPUP, this.onOpenLevelUpPopup.bind(this));
        addEventListener(GameEvents.CLOSE_LEVEL_UP_POPUP, this.onCloseLevelUpPopup.bind(this));
        addEventListener(GameEvents.OPEN_TUTORIAL_POPUP, this.onOpenTutorialPopup.bind(this));
        addEventListener(GameEvents.CLOSE_TUTORIAL_POPUP, this.onCloseTutorialPopup.bind(this));
        addEventListener(GameEvents.OPEN_INFO_POPUP, this.onOpenInfoPopup.bind(this));
        addEventListener(GameEvents.CLOSE_INFO_POPUP, this.onCloseInfoPopup.bind(this));
        addEventListener(GameEvents.OPEN_INPUT_POPUP, this.onOpenInputPopup.bind(this));
        addEventListener(GameEvents.CLOSE_INPUT_POPUP, this.onCloseInputPopup.bind(this));
        addEventListener(GameEvents.OPEN_MAINTENANCE_POPUP, this.onOpenMaintenancePopup.bind(this));
        addEventListener(GameEvents.CLOSE_MAINTENANCE_POPUP, this.onCloseMaintenancePopup.bind(this));
        addEventListener(GameEvents.OPEN_DEPOSIT_POPUP, this.onOpenDepositPopup.bind(this));
        addEventListener(GameEvents.CLOSE_DEPOSIT_POPUP, this.onCloseDepositPopup.bind(this));

    }

    onOpenMaintenancePopup(): void {
        if (this.maintenancePopup) {
            return;
        }

        this.maintenancePopup = new MaintenancePopup();
        this.addChild(this.maintenancePopup);
    }

    async onCloseMaintenancePopup(): Promise<void> {
        if (!this.maintenancePopup) {
            return;
        }
        await this.maintenancePopup.show(false);
        this.removeChild(this.maintenancePopup);
        this.maintenancePopup.destroy();
        this.maintenancePopup = null;
    }

    onOpenInputPopup(e: MessageEvent): void {
        if (this.inputPopup) {
            return;
        }
        let inputPopupData: InputPopupData = e.data;
        this.inputPopup = new InputPopup(inputPopupData);
        this.addChild(this.inputPopup);
    }

    async onCloseInputPopup(): Promise<void> {
        if (!this.inputPopup) {
            return;
        }
        await this.inputPopup.show(false);
        this.removeChild(this.inputPopup);
        this.inputPopup.destroy();
        this.inputPopup = null;
    }

    onOpenInfoPopup(e: MessageEvent): void {
        if (this.infoPopup) {
            return;
        }
        let infoPopupData: InfoPopupData = e.data;
        this.infoPopup = new InfoPopup(infoPopupData);
        this.addChild(this.infoPopup);
    }

    async onCloseInfoPopup(): Promise<void> {
        if (!this.infoPopup) {
            return;
        }
        await this.infoPopup.show(false);
        this.removeChild(this.infoPopup);
        this.infoPopup.destroy();
        this.infoPopup = null;
    }

    onOpenTutorialPopup(): void {
        if (this.tutorialPopup) {
            return;
        }
        this.tutorialPopup = new TutorialPopup();
        this.addChild(this.tutorialPopup);
    }

    async onCloseTutorialPopup(): Promise<void> {
        if (!this.tutorialPopup) {
            return;
        }
        await this.tutorialPopup.show(false);
        this.removeChild(this.tutorialPopup);
        this.tutorialPopup.destroy();
        this.tutorialPopup = null;
    }

    onOpenLevelUpPopup(e: MessageEvent): void {
        if (this.levelUpPopup) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.SET_SCREEN_BLUR));
        let levelUpMessageData: LevelUpEventMessage = e.data;
        this.levelUpPopup = new LevelUpPopup(levelUpMessageData);
        this.addChild(this.levelUpPopup);
    }

    async onCloseLevelUpPopup(): Promise<void> {
        if (!this.levelUpPopup) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.CLEAR_SCREEN_BLUR));
        await this.levelUpPopup.show(false);
        this.removeChild(this.levelUpPopup);
        this.levelUpPopup.destroy();
        this.levelUpPopup = null;
    }

    onOpenLeaveGamePopup(): void {
        if (this.leaveGamePopup) {
            return;
        }
        this.leaveGamePopup = new LeaveGamePopup();
        this.addChild(this.leaveGamePopup);
    }

    async onCloseLeaveGamePopup(): Promise<void> {
        if (!this.leaveGamePopup) {
            return;
        }
        await this.leaveGamePopup.show(false);
        this.removeChild(this.leaveGamePopup);
        this.leaveGamePopup.destroy();
        this.leaveGamePopup = null;
    }

    onOpenDialogPopup(e: MessageEvent): void {
        if (this.dialogPopup) {
            return;
        }

        let data: DialogPopupData = e.data;
        this.dialogPopup = new DialogPopup(data);
        this.addChild(this.dialogPopup);
    }

    async onCloseDialogPopup(): Promise<void> {
        if (!this.dialogPopup) {
            return;
        }
        await this.dialogPopup.show(false);
        this.removeChild(this.dialogPopup);
        this.dialogPopup.destroy();
        this.dialogPopup = null;
    }

    onOpenStorePopup(): void {
        if (this.storePopup) {
            return;
        }

        this.storePopup = new StorePopup();
        this.addChild(this.storePopup);
    }

    async onCloseStorePopup(): Promise<void> {
        if (!this.storePopup) {
            return;
        }
        await this.storePopup.show(false);
        this.removeChild(this.storePopup);
        this.storePopup.destroy();
        this.storePopup = null;
    }

    onOpenMessagesPopup(e: MessageEvent): void {
        if (this.messagesPopup) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.SET_SCREEN_BLUR));
        let messages: ChatEventMessage[] = e.data?.messages;
        let profile: ProfileData = e.data?.profile;
        this.messagesPopup = new MessagesPopup(messages, profile);
        this.addChild(this.messagesPopup);
    }

    async onCloseMessagesPopup(): Promise<void> {
        if (!this.messagesPopup) {
            return;
        }
        if (!this.friendsPopup && !this.profilePopup) {
            dispatchEvent(new MessageEvent(GameEvents.CLEAR_SCREEN_BLUR));
        }
        await this.messagesPopup.show(false);
        this.removeChild(this.messagesPopup);
        this.messagesPopup.destroy();
        this.messagesPopup = null;
    }

    onOpenWheelPopup(): void {
        if (this.wheelPopup) {
            return;
        }
        this.wheelPopup = new WheelPopup();
        this.addChild(this.wheelPopup);
    }

    async onCloseWheelPopup(): Promise<void> {
        if (!this.wheelPopup) {
            return;
        }
        await this.wheelPopup.show(false);
        this.removeChild(this.wheelPopup);
        this.wheelPopup.destroy();
        this.wheelPopup = null;
    }

    onOpenFriendsPopup(): void {
        if (this.friendsPopup) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.SET_SCREEN_BLUR));
        this.friendsPopup = new FriendsPopup();
        this.addChild(this.friendsPopup);
    }

    async onCloseFriendsPopup(): Promise<void> {
        if (!this.friendsPopup) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.CLEAR_SCREEN_BLUR));
        await this.friendsPopup.show(false);
        this.removeChild(this.friendsPopup);
        this.friendsPopup.destroy();
        this.friendsPopup = null;
    }

    onOpenSettingsPopup(): void {
        if (this.settingsPopup) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.SET_SCREEN_BLUR));
        this.settingsPopup = new SettingsPopup();
        this.addChild(this.settingsPopup);
    }

    async onCloseSettingsPopup(): Promise<void> {
        if (!this.settingsPopup) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.CLEAR_SCREEN_BLUR));
        await this.settingsPopup.show(false);
        this.removeChild(this.settingsPopup);
        this.settingsPopup.destroy();
        this.settingsPopup = null;
    }

    onOpenEditProfilePopup(): void {
        if (this.editProfilePopup) {
            return;
        }
        this.editProfilePopup = new EditProfilePopup();
        this.addChild(this.editProfilePopup);
    }

    async onCloseEditProfilePopup(): Promise<void> {
        if (!this.editProfilePopup) {
            return;
        }
        await this.editProfilePopup.show(false);
        this.removeChild(this.editProfilePopup);
        this.editProfilePopup.destroy();
        this.editProfilePopup = null;
    }

    onOpenProfilePopup(e: MessageEvent): void {
        if (this.profilePopup) {
            return;
        }
        dispatchEvent(new MessageEvent(GameEvents.SET_SCREEN_BLUR));
        let profileData: ProfileData = e.data.profileData;
        let overlayAlpha: number = e.data.overlayAlpha;
        this.profilePopup = new ProfilePopup(profileData, overlayAlpha);
        this.addChild(this.profilePopup);
    }

    async onCloseProfilePopup(): Promise<void> {
        if (!this.profilePopup) {
            return;
        }
        if (!this.friendsPopup && !this.messagesPopup) {
            dispatchEvent(new MessageEvent(GameEvents.CLEAR_SCREEN_BLUR));
        }
        await this.profilePopup.show(false);
        this.removeChild(this.profilePopup);
        this.profilePopup.destroy();
        this.profilePopup = null;
    }

    onOpenDepositPopup(): void {
        if (this.depositPopup) {
            return;
        }
        this.depositPopup = new DepositPopup();
        this.addChild(this.depositPopup);
    }

    async onCloseDepositPopup(): Promise<void> {
        if (!this.depositPopup) {
            return;
        }
        await this.depositPopup.show(false);
        this.removeChild(this.depositPopup);
        this.depositPopup.destroy();
        this.depositPopup = null;
    }

}