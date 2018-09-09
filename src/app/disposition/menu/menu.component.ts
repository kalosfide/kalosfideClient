import { Component, Input, OnInit } from '@angular/core';
import { IMenu } from '../../menus/imenu';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styles: []
})
export class MenuComponent implements OnInit {
    @Input() menu: IMenu;

    constructor() { }

    ngOnInit() {
    }

}
