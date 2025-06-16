import {FriendListItemType} from "./current_friends_page/friends_list/friend_list_item/FriendListItemType";
import {FriendsListItem} from "./current_friends_page/friends_list/FriendsListItem";
import {FriendsList} from "./current_friends_page/FriendsList";
import {FriendsPage} from "./current_friends_page/FriendsPage";


export class LastPlayedPage extends FriendsPage {
    private lastPlayed: FriendsList;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.createList();
    }

    createChildren(): void {
        this.lastPlayed = new FriendsList();
    }

    addChildren(): void {
        this.addChild(this.lastPlayed);
    }

    initChildren(): void {
        this.lastPlayed.y = -240;
    }

    get dragged(): boolean {
        return this.lastPlayed.dragged;
    }

    createList(): void {
        this.lastPlayed.createList([].map(data => new FriendsListItem(data, FriendListItemType.FIND)));
    }

    destroy(): void {
        this.removeChild(this.lastPlayed);
        this.lastPlayed.destroy();
        this.lastPlayed = null;

        super.destroy();
    }
}
