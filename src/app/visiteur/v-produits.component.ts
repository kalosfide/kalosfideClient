import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageDef } from '../commun/page-def';
import { ProduitIndexBaseComponent } from '../produits/produit-index-base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitService } from '../modeles/produit.service';
import { VisiteurPages } from './visiteur-pages';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class VProduitsComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = VisiteurPages.produits;
    pageDef: PageDef = VisiteurPages.produits;

    get titre(): string {
        return this.pageDef.title;
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
