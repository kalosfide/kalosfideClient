import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategorieALESComponent } from './categorie-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { CategoriePages } from './categorie-pages';
import { CategorieService } from 'src/app/modeles/categorie.service';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
    styles: []
})
export class CategorieEditeComponent extends CategorieALESComponent {

    static _pageDef: PageDef = CategoriePages.edite;
    pageDef: PageDef = CategoriePages.edite;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: CategorieService,
        protected attenteAsyncService: AttenteAsyncService,
        protected navigationService: NavigationService,
    ) {
        super(router, route, service, attenteAsyncService, navigationService);

        this.titreRésultatErreur = 'Mise à jour impossible';
    }

}
