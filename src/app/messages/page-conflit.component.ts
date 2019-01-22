import { Component } from '@angular/core';
import { PageMessageComponent } from '../disposition/page-message/page-message.component';
import { PageDef } from 'src/app/commun/page-def';
import { AppPages } from 'src/app/app-pages';

@Component({
    templateUrl: '../disposition/page-message/page-message.component.html',
    styles: []
})
export class PageConflitComponent extends PageMessageComponent {

    static _pageDef: PageDef = AppPages.conflit;
    pageDef: PageDef = AppPages.conflit;

    messages = ['Les ressource demandées sont verrouillées car en cours d\'utilisation.'];

    constructor() {
        super();
    }

}
