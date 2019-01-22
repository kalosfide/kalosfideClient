import { Component } from '@angular/core';
import { PageMessageComponent } from '../disposition/page-message/page-message.component';
import { PageDef } from 'src/app/commun/page-def';
import { AppPages } from 'src/app/app-pages';

@Component({
    templateUrl: '../disposition/page-message/page-message.component.html',
    styles: []
})
export class PageIntrouvableComponent extends PageMessageComponent {

    static _pageDef: PageDef = AppPages.introuvable;
    pageDef: PageDef = AppPages.introuvable;

    messages = ['Les ressource demandées sont introuvables.'];

    constructor() {
        super();
    }

}
