import {Sprite} from "pixi.js";
import {DynamicData} from "../../../../DynamicData";
import {GameEvents} from "../../../../GameEvents";
import {FriendStatus} from "../../../../services/socket_service/socket_message_data/friend_data/FriendStatus";
import {FriendData} from "../../../../services/socket_service/socket_message_data/FriendData";
import {BigPopupBody} from "./friends_popup_content/BigPopupBody";
import {CurrentFriendsPage} from "./friends_popup_content/CurrentFriendsPage";
import {FindFriendsPage} from "./friends_popup_content/FindFriendsPage";
import {FriendsTabNames} from "./friends_popup_content/friends_tabs/FriendsTabNames";
import {FriendsSharePage} from "./friends_popup_content/FriendsSharePage";
import {FriendsTabs} from "./friends_popup_content/FriendsTabs";
import {LastPlayedPage} from "./friends_popup_content/LastPlayedPage";
import {NewRequestsPage} from "./friends_popup_content/NewRequestsPage";


export class FriendsPopupContent extends Sprite {
    private body: BigPopupBody;
    private tabs: FriendsTabs;
    private currentPage: Sprite;
    private onTabClickedBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.placeCurrentPage();
        this.onTabClickedBindThis = this.onTabClicked.bind(this);
        addEventListener(GameEvents.FRIENDS_TAB_CLICKED, this.onTabClickedBindThis);
    }

    createChildren(): void {
        this.body = new BigPopupBody(this.onClose.bind(this), "FRIENDS");

        let newRequests: FriendData[] = DynamicData.myFriends.filter(friend => friend.type == FriendStatus.INCOMING);
        let currentFriends: FriendData[] = DynamicData.myFriends.filter(friend => friend.type == FriendStatus.ACCEPTED);
        switch (true) {
            case !!newRequests.length:
                this.currentPage = new NewRequestsPage();
                this.tabs = new FriendsTabs(FriendsTabNames.NEW_REQUESTS);
                break;
            case !!currentFriends.length:
                this.currentPage = new CurrentFriendsPage();
                this.tabs = new FriendsTabs(FriendsTabNames.FRIENDS);
                break;
            default:
                this.currentPage = new FindFriendsPage();
                this.tabs = new FriendsTabs(FriendsTabNames.FIND_FRIENDS);
        }
    }

    addChildren(): void {
        this.addChild(this.body);
        this.addChild(this.tabs);
        this.addChild(this.currentPage);
    }

    initChildren(): void {
        this.tabs.x = -487;
        this.tabs.y = -250;
    }

    placeCurrentPage() {
        this.currentPage.x = 180;
        this.currentPage.y = 13;
    }

    onTabClicked(e: MessageEvent) {
        let tabName: FriendsTabNames = e.data.name;

        this.removeChild(this.currentPage);
        this.currentPage?.destroy();
        this.currentPage = null;

        switch (tabName) {
            case FriendsTabNames.FRIENDS:
                this.currentPage = new CurrentFriendsPage();
                break;
            case FriendsTabNames.NEW_REQUESTS:
                this.currentPage = new NewRequestsPage();
                break;
            case FriendsTabNames.FIND_FRIENDS:
                this.currentPage = new FindFriendsPage();
                break;
            case FriendsTabNames.LAST_PLAYED:
                this.currentPage = new LastPlayedPage();
                break;
            case FriendsTabNames.SHARE:
                this.currentPage = new FriendsSharePage();
                break;
            default:
                this.currentPage = new CurrentFriendsPage();
        }
        this.addChild(this.currentPage);
        this.placeCurrentPage();
    }

    onClose() {
        (this.currentPage as CurrentFriendsPage)?.dragged ||
        dispatchEvent(new MessageEvent(GameEvents.CLOSE_FRIENDS_POPUP));
    }

    destroy(): void {
        removeEventListener(GameEvents.FRIENDS_TAB_CLICKED, this.onTabClickedBindThis);
        this.onTabClickedBindThis = null;

        this.removeChild(this.body);
        this.removeChild(this.tabs);
        this.removeChild(this.currentPage);

        this.body.destroy();
        this.tabs.destroy();
        this.currentPage.destroy();

        this.body = null;
        this.tabs = null;
        this.currentPage = null;

        super.destroy();
    }
}
