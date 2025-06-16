import {NineSlicePlane, Point, Sprite} from "pixi.js";
import {DynamicData} from "../../../../../DynamicData";
import {DisplayObjectFactory} from "@azur-games/pixi-vip-framework";
import {GameEvents} from "../../../../../GameEvents";
import {ChatMessagesService} from "../../../../../services/ChatMessagesService";
import {FriendStatus} from "../../../../../services/socket_service/socket_message_data/friend_data/FriendStatus";
import {ProfileData} from "../../../../../services/socket_service/socket_message_data/ProfileData";
import {Pivot} from "@azur-games/pixi-vip-framework";
import {NoFriendsPlaceholder} from "../../friends_popup/friends_popup_content/current_friends_page/NoFriendsPlaceholder";
import {ChatsList} from "./chats_list_page/ChatsList";
import {EmptyListPlaceholder} from "./chats_list_page/EmptyListPlaceholder";
import {ChatsSearchInput} from "./ChatsSearchInput";


export class ChatsListPage extends Sprite {
    private background: NineSlicePlane;
    private searchInput: ChatsSearchInput;
    private noFriendFoundPlaceholder: NoFriendsPlaceholder;
    private noMessagePlaceholder: EmptyListPlaceholder;
    chatsList: ChatsList;
    private onSearchChatsBindThis: (e: MessageEvent) => void;

    constructor() {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
        this.initList();

        this.onSearchChatsBindThis = this.onSearchChats.bind(this);
        addEventListener(GameEvents.ON_CHATS_SEARCH, this.onSearchChatsBindThis);
    }

    createChildren(): void {
        this.background = DisplayObjectFactory.createNineSlicePlane("friends/page_bg", 30, 30, 30, 30);
        this.searchInput = new ChatsSearchInput("messages/icon_loupe");
        this.noFriendFoundPlaceholder = new NoFriendsPlaceholder("ChatsWindow/NoFriendFound");
        this.noMessagePlaceholder = new EmptyListPlaceholder("messages/art_messages", "ChatWindow/list/empty", new Point(0, 120));
        this.chatsList = new ChatsList();
    }

    addChildren(): void {
        this.addChild(this.background);
        this.addChild(this.searchInput);
        this.addChild(this.noFriendFoundPlaceholder).visible = false;
        this.addChild(this.noMessagePlaceholder).visible = false;
        this.addChild(this.chatsList);
    }

    initChildren(): void {
        this.background.width = 1354;
        this.background.height = 564;

        Pivot.center(this.background);

        this.background.y = 60;
        this.searchInput.y = -258;
        this.chatsList.y = -175;
        this.noMessagePlaceholder.y = 50;
    }

    onSearchChats(e: MessageEvent): void {
        let searchRequest: string = e.data;

        if (!searchRequest) {
            this.noFriendFoundPlaceholder.visible = false;
            this.initList();
            return;
        }
        this.noMessagePlaceholder.visible = false;

        let foundedFriends: ProfileData[] = DynamicData.myFriends
            .filter(friend => friend.type == FriendStatus.ACCEPTED && friend.name.toLowerCase().includes(searchRequest.toLowerCase()))
            .map(friend => friend.profile);
        this.noFriendFoundPlaceholder.visible = !foundedFriends.length;
        this.chatsList.updateList(foundedFriends);
    }

    async initList(): Promise<void> {
        let profileIds: number[] = Array.from(ChatMessagesService.userMessagesStatusByIdMap.keys());

        if (!profileIds.length) {
            this.noMessagePlaceholder.visible = true;
            this.chatsList.updateList([]);
            return;
        }
        this.noMessagePlaceholder.visible = false;

        let profiles: ProfileData[] = await Promise.all(profileIds.map(id => DynamicData.profiles.getFullProfileById(id)));
        this.chatsList.updateList(profiles);
    }

    clearInput(): void {
        this.searchInput.cancel();
    }

    updateOnlineStatus(): void {
        this.chatsList.updateOnlineStatus();
    }

    destroy(): void {
        removeEventListener(GameEvents.ON_CHATS_SEARCH, this.onSearchChatsBindThis);
        this.onSearchChatsBindThis = null;

        this.removeChild(this.background);
        this.removeChild(this.searchInput);
        this.removeChild(this.noFriendFoundPlaceholder);
        this.removeChild(this.noMessagePlaceholder);
        this.removeChild(this.chatsList);

        this.background.destroy();
        this.searchInput.destroy();
        this.noFriendFoundPlaceholder.destroy();
        this.noMessagePlaceholder.destroy();
        this.chatsList.destroy();

        this.background = null;
        this.searchInput = null;
        this.noFriendFoundPlaceholder = null;
        this.noMessagePlaceholder = null;
        this.chatsList = null;

        super.destroy();
    }

}
