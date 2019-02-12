import { Component, Input, OnInit } from '@angular/core';
import { ItemDeMenu } from 'src/app/disposition/menus/item-de-menu';
import { Menu } from 'src/app/disposition/menus/menu';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styles: []
})
export class MenuComponent implements OnInit {
    @Input() menu: Menu;

    constructor() { }

    ngOnInit() {
    }

    get items(): ItemDeMenu[] {
        return this.menu.itemsAction.filter(i => i.visible);
    }

}
