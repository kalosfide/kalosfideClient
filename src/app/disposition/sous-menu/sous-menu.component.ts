import { Component, Input, OnInit } from '@angular/core';

import { IMenu } from '../../menus/imenu';

@Component({
  selector: 'app-sous-menu',
  templateUrl: './sous-menu.component.html',
  styles: []
})
export class SousMenuComponent implements OnInit {
    @Input() menu: IMenu;

  constructor() { }

  ngOnInit() {
  }

}
