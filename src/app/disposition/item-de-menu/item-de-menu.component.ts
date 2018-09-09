import { Component, Input, OnInit } from '@angular/core';
import { IItemDeMenu } from '../../menus/imenu';

@Component({
    selector: 'app-item-de-menu',
    templateUrl: './item-de-menu.component.html',
    styles: []
})
export class ItemDeMenuComponent implements OnInit {
    @Input() item: IItemDeMenu;

    constructor() { }

    ngOnInit() {
    }

    get avecSousMenu(): boolean {
        return !!this.item.sousMenu;
    }

}
