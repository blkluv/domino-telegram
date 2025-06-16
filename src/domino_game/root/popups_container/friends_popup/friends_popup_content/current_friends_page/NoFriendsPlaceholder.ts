import {Spine} from "pixi-spine";
import {Sprite} from "pixi.js";
import {SpineFactory} from "../../../../../../factories/SpineFactory";
import {EmptyListPlaceholder} from "../../../messages_popup/messages_popup_content/chats_list_page/EmptyListPlaceholder";


export class NoFriendsPlaceholder extends Sprite {
    private placeholder: EmptyListPlaceholder;
    private loupeSpine: Spine;

    constructor(private textKey: string) {
        super();
        this.createChildren();
        this.addChildren();
        this.initChildren();
    }

    createChildren(): void {
        this.placeholder = new EmptyListPlaceholder("friends/find_friends_art", this.textKey);
        this.loupeSpine = SpineFactory.createLoupeSpine();
    }

    addChildren(): void {
        this.addChild(this.placeholder);
        this.addChild(this.loupeSpine);
    }

    applyTextPlaceholders(values: string[]) {
        this.placeholder.text.applyPlaceholders(values);
    }

    initChildren(): void {
        this.loupeSpine.y = 30;
    }

    destroy(): void {
        this.loupeSpine.state.timeScale = 0;

        this.removeChild(this.placeholder);
        this.removeChild(this.loupeSpine);

        this.placeholder.destroy();
        this.loupeSpine.destroy();

        this.placeholder = null;
        this.loupeSpine = null;

        super.destroy();
    }
}
