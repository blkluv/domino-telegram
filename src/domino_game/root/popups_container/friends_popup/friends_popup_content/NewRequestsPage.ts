import {DynamicData} from "../../../../../DynamicData";
import {GameEvents} from "../../../../../GameEvents";
import {FriendStatus} from "../../../../../services/socket_service/socket_message_data/friend_data/FriendStatus";
import {FriendData} from "../../../../../services/socket_service/socket_message_data/FriendData";
import {EmptyListPlaceholder} from "../../messages_popup/messages_popup_content/chats_list_page/EmptyListPlaceholder";
import {FriendListItemType} from "./current_friends_page/friends_list/friend_list_item/FriendListItemType";
import {FriendsListItem} from "./current_friends_page/friends_list/FriendsListItem";
import {FriendsList} from "./current_friends_page/FriendsList";
import {FriendsPage} from "./current_friends_page/FriendsPage";


export class NewRequestsPage extends FriendsPage {
    newRequests: FriendsList;
    private placeholder: EmptyListPlaceholder;
    private createListBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.createList();

        this.createListBindThis = this.createList.bind(this);
        addEventListener(GameEvents.ON_FRIENDS_CHANGE, this.createListBindThis);
    }

    createChildren(): void {
        this.newRequests = new FriendsList();
        this.placeholder = new EmptyListPlaceholder("friends/noreq_art", "FriendWindow.no-invites-placeholder");
    }

    addChildren(): void {
        this.addChild(this.newRequests);
        this.addChild(this.placeholder);
    }

    initChildren(): void {
        this.newRequests.y = -295;
        this.placeholder.y = -80;
    }

    createList(): void {
        let newRequests: FriendData[] = DynamicData.myFriends.filter(friend => friend.type == FriendStatus.INCOMING);
        this.newRequests.createList(newRequests.map(data => new FriendsListItem(data.profile, FriendListItemType.NEW_REQUEST)), 55);
        this.placeholder.visible = !newRequests.length;
    }

    get dragged(): boolean {
        return this.newRequests.dragged;
    }

    destroy(): void {
        removeEventListener(GameEvents.ON_FRIENDS_CHANGE, this.createListBindThis);
        this.createListBindThis = null;

        this.removeChild(this.placeholder);
        this.removeChild(this.newRequests);
        this.placeholder.destroy();
        this.newRequests.destroy();
        this.placeholder = null;
        this.newRequests = null;

        super.destroy();
    }
}
