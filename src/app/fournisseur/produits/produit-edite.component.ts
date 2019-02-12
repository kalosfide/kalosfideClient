import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitALESComponent } from './produit-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitPages } from './produit-pages';
import { ProduitService } from 'src/app/modeles/produit.service';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { NavigationService } from 'src/app/services/navigation.service';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styles: []
})
export class ProduitEditeComponent extends ProduitALESComponent {

    static _pageDef: PageDef = ProduitPages.edite;
    pageDef: PageDef = ProduitPages.edite;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
        protected attenteAsyncService: AttenteAsyncService,
        protected navigationService: NavigationService,
    ) {
        super(router, route, service, attenteAsyncService, navigationService);

        this.titreRésultatErreur = 'Mise à jour impossible';
    }

}
