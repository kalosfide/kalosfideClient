import { Component, Input, OnInit } from '@angular/core';
import { ItemDeMenu } from './item-de-menu';
import { KfContenuPhrase } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';

@Component({
    selector: 'app-item-de-menu',
    templateUrl: './item-de-menu.component.html',
    styles: []
})
export class ItemDeMenuComponent implements OnInit {
    @Input() item: ItemDeMenu;

    contenuPhrase: KfContenuPhrase;

    constructor() { }

    ngOnInit() {
    }

    get avecSousMenu(): boolean {
        return !!this.item.items;
    }

}
