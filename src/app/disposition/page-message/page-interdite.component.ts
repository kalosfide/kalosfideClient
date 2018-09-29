import { Component } from '@angular/core';
import { PageMessageComponent } from './page-message.component';
import { RouteurService } from '../../services/routeur.service';

@Component({
    templateUrl: './page-message.component.html',
    styles: []
})
export class PageInterditeComponent extends PageMessageComponent {

    titre = 'Accès refusé';
    message: 'L\'accès à cette page est réservé.';
    urlDeSortie: string;

    constructor(
        protected service: RouteurService
    ) {
        super();
    }

}
