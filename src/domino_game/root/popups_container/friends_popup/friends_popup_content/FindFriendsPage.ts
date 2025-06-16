import {DynamicData} from "../../../../../DynamicData";
import {GameEvents} from "../../../../../GameEvents";
import {ProfileData} from "../../../../../services/socket_service/socket_message_data/ProfileData";
import {SocketService} from "../../../../../services/SocketService";
import {EmptyListPlaceholder} from "../../messages_popup/messages_popup_content/chats_list_page/EmptyListPlaceholder";
import {FriendsPage} from "./current_friends_page/FriendsPage";
import {NoFriendsPlaceholder} from "./current_friends_page/NoFriendsPlaceholder";
import {FindFriendsInput} from "./find_friends_page/FindFriendsInput";
import {FoundedProfilesList} from "./find_friends_page/FoundedProfilesList";
import {FriendListItemType} from "./current_friends_page/friends_list/friend_list_item/FriendListItemType";
import {FriendsListItem} from "./current_friends_page/friends_list/FriendsListItem";
import {LoginToFBText} from "./find_friends_page/LoginToFBText";


export class FindFriendsPage extends FriendsPage {
    private loginToFBText: LoginToFBText;
    private foundedProfilesList: FoundedProfilesList;
    private input: FindFriendsInput;
    private handleSearchRequestBindThis: (e: MessageEvent) => void;
    private initialPlaceholder: EmptyListPlaceholder;
    private noFoundedPlaceholder: NoFriendsPlaceholder;
    private moreSymbolsPlaceholder: EmptyListPlaceholder;
    private minSearchLength: number = 2;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.handleSearchRequestBindThis = this.handleSearchRequest.bind(this);
        addEventListener(GameEvents.ON_FRIENDS_SEARCH, this.handleSearchRequestBindThis);
    }

    createChildren(): void {
        this.initialPlaceholder = new EmptyListPlaceholder("friends/art_fb2", "");
        this.noFoundedPlaceholder = new NoFriendsPlaceholder("FriendWindow.nothing-found");
        this.moreSymbolsPlaceholder = new EmptyListPlaceholder("friends/err_art", "findFriends.needMoreSymbols");
        this.loginToFBText = new LoginToFBText();
        this.foundedProfilesList = new FoundedProfilesList();
        this.input = new FindFriendsInput();
    }

    addChildren(): void {
        this.addChild(this.initialPlaceholder);
        this.addChild(this.noFoundedPlaceholder).visible = false;
        this.addChild(this.moreSymbolsPlaceholder).visible = false;
        this.addChild(this.loginToFBText);
        this.addChild(this.input);
        this.addChild(this.foundedProfilesList).visible = false;
    }

    initChildren(): void {
        this.input.y = -250;
        this.input.x = -190;
        this.foundedProfilesList.y = -175;
        this.loginToFBText.y = 200;
        this.moreSymbolsPlaceholder.text.style.fill = 0xdc3739;
        this.moreSymbolsPlaceholder.text.setTextStroke(0x750D29, 4);
    }

    async handleSearchRequest(e: MessageEvent): Promise<void> {
        let searchValue: string = e.data;
        let profiles: ProfileData[] = [];
        if (searchValue.length > this.minSearchLength) {
            let foundedProfiles: ProfileData[] = await SocketService.findProfilesByNamePart(searchValue);
            profiles = foundedProfiles.filter(profile => profile.id != DynamicData.myProfile.id);
        }

        this.updateList(profiles);
        this.moreSymbolsPlaceholder.visible = !!searchValue && searchValue.length <= this.minSearchLength;
        this.noFoundedPlaceholder.visible = !this.moreSymbolsPlaceholder.visible && !profiles.length && !!searchValue;
        this.noFoundedPlaceholder.visible && this.noFoundedPlaceholder.applyTextPlaceholders([searchValue]);
        this.loginToFBText.visible = !searchValue;
        this.initialPlaceholder.visible = !searchValue;
    }

    get dragged(): boolean {
        return this.foundedProfilesList.dragged;
    }

    updateList(profiles: ProfileData[]): void {
        this.foundedProfilesList.createList(profiles.map(data => new FriendsListItem(data, FriendListItemType.FIND)), 55);
        this.foundedProfilesList.visible = !!profiles.length;
    }

    destroy(): void {
        removeEventListener(GameEvents.ON_FRIENDS_SEARCH, this.handleSearchRequestBindThis);
        this.handleSearchRequestBindThis = null;

        this.removeChild(this.initialPlaceholder);
        this.removeChild(this.noFoundedPlaceholder);
        this.removeChild(this.input);
        this.removeChild(this.foundedProfilesList);
        this.removeChild(this.loginToFBText);

        this.initialPlaceholder.destroy();
        this.noFoundedPlaceholder.destroy();
        this.input.destroy();
        this.foundedProfilesList.destroy();
        this.loginToFBText.destroy();

        this.initialPlaceholder = null;
        this.noFoundedPlaceholder = null;
        this.input = null;
        this.foundedProfilesList = null;
        this.loginToFBText = null;

        super.destroy();
    }
}
