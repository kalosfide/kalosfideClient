import { Component, OnInit, OnDestroy } from '@angular/core';
import { FournisseurPages } from '../fournisseur-pages';
import { ProduitPages } from './produit-pages';
import { ProduitIndexBaseComponent } from 'src/app/produits/produit-index-base.component';
import { PageDef } from 'src/app/commun/page-def';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitService } from 'src/app/modeles/produit.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FProduitsComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = ProduitPages.visite;
    pageDef: PageDef = ProduitPages.visite;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = null;
    dataRoutes = null;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(router, route, service);
    }

}
