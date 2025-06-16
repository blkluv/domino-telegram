import {DynamicData} from "../../../../../DynamicData";
import {GameEvents} from "../../../../../GameEvents";
import {FriendStatus} from "../../../../../services/socket_service/socket_message_data/friend_data/FriendStatus";
import {FriendData} from "../../../../../services/socket_service/socket_message_data/FriendData";
import {FriendListItemType} from "./current_friends_page/friends_list/friend_list_item/FriendListItemType";
import {FriendsListItem} from "./current_friends_page/friends_list/FriendsListItem";
import {FriendsList} from "./current_friends_page/FriendsList";
import {FriendsPage} from "./current_friends_page/FriendsPage";
import {NoFriendsPlaceholder} from "./current_friends_page/NoFriendsPlaceholder";


export class CurrentFriendsPage extends FriendsPage {
    private currentFriends: FriendsList;
    private placeholder: NoFriendsPlaceholder;
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
        this.currentFriends = new FriendsList();
        this.placeholder = new NoFriendsPlaceholder("FriendWindow.no-friends-placeholder");
    }

    addChildren(): void {
        this.addChild(this.currentFriends);
        this.addChild(this.placeholder);
    }

    initChildren(): void {
        this.currentFriends.y = -295;
        this.placeholder.y = -80;
    }

    createList(): void {
        let currentFriendsData: FriendData[] = DynamicData.myFriends.filter(friend => friend.type == FriendStatus.ACCEPTED);
        this.currentFriends.createList(currentFriendsData.map(data => new FriendsListItem(data.profile, FriendListItemType.CURRENT)), 55);
        this.placeholder.visible = !currentFriendsData.length;
    }

    get dragged(): boolean {
        return this.currentFriends.dragged;
    }

    destroy(): void {
        removeEventListener(GameEvents.ON_FRIENDS_CHANGE, this.createListBindThis);
        this.createListBindThis = null;

        this.removeChild(this.placeholder);
        this.removeChild(this.currentFriends);
        this.placeholder.destroy();
        this.currentFriends.destroy();
        this.placeholder = null;
        this.currentFriends = null;

        super.destroy();
    }
}
