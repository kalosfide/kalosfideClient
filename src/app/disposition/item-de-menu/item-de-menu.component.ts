import { Component, Input, OnInit } from '@angular/core';
import { ItemDeMenu } from '../../menus/item-de-menu';
import { KfTexteImage } from 'src/app/commun/kf-composants/kf-partages/kf-texte-image/kf-texte-image';

@Component({
    selector: 'app-item-de-menu',
    templateUrl: './item-de-menu.component.html',
    styles: []
})
export class ItemDeMenuComponent implements OnInit {
    @Input() item: ItemDeMenu;

    texteImage: KfTexteImage;

    constructor() { }

    ngOnInit() {
        this.texteImage = new KfTexteImage(() => this.item.texte);
        this.texteImage.fixeImageAvant(this.item.image);
    }

    get avecSousMenu(): boolean {
        return !!this.item.sousMenu;
    }
    get route(): any[] {
        return this.item.inactif ? [] : this.item.route;
    }

}
