import {Sprite} from "pixi.js";
import {SettingsFooterLink} from "./SettingsFooterLink";


export class SettingsFooterRow extends Sprite {
    private margin: number = 60;
    private maxLinksWidth: number = 1100;
    private linksTotalWidth: number = 0;
    private containerWidth: number = 0;

    constructor(private links: SettingsFooterLink[]) {
        super();
        this.links.forEach(link => {
            this.addChild(link);
            this.linksTotalWidth += link.languageText.width;
        });
        this.placeLinks();
    }

    placeLinks(): void {
        this.containerWidth = 0;
        // this.margin = (this.maxLinksWidth - this.linksTotalWidth) / links.length
        this.links.forEach((link) => {
            link.x = this.containerWidth + link.languageText.width / 2;
            this.containerWidth += link.languageText.width + this.margin;
        });
        this.containerWidth > this.maxLinksWidth && this.scale.set(this.maxLinksWidth / this.containerWidth);
        this.x = -this.containerWidth * this.scale.x / 2 + this.margin / 2;
    }

    destroy(): void {
        let link: SettingsFooterLink;
        while (this.links.length) {
            link = this.links.shift();
            this.removeChild(link);
            link.destroy();
        }
        this.links = null;
        super.destroy();
    }
}
