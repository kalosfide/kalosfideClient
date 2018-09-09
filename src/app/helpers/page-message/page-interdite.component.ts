import { Component } from '@angular/core';
import { HelpersService } from '../helpers.service';
import { PageMessageComponent } from './page-message.component';

@Component({
    templateUrl: './page-message.component.html',
    styles: []
})
export class PageInterditeComponent extends PageMessageComponent {

    titre = 'Accès refusé';
    message: 'L\'accès à cette page est réservé.';
    urlDeSortie: string;

    constructor(
        protected service: HelpersService
    ) {
        super();
    }

}
