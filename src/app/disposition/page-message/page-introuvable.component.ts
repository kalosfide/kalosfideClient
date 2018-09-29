import { Component, OnInit } from '@angular/core';
import { PageMessageComponent } from './page-message.component';
import { RouteurService } from '../../services/routeur.service';

@Component({
    templateUrl: './page-message.component.html',
    styles: []
})
export class PageIntrouvableComponent extends PageMessageComponent implements OnInit {

    titre = 'Page introuvable';
    message: string;
    urlDeSortie: string;

    constructor(
        protected service: RouteurService
    ) {
        super();
    }

    ngOnInit() {
        let pageUrl: string = this.service.erreurDeRoute;
        pageUrl = pageUrl ? ' ' + pageUrl : '';
        this.message = 'La page demandée' + pageUrl + ' n\'existe pas sur ce site.';
    }

}
