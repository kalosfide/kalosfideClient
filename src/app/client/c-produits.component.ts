import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageDef } from '../commun/page-def';
import { ProduitIndexBaseComponent } from '../produits/produit-index-base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitService } from '../modeles/produit.service';
import { ClientPages } from './client-pages';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class CProduitsComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = ClientPages.produits;
    pageDef: PageDef = ClientPages.produits;

    get titre(): string {
        return this.pageDef.title;
    }

    dataPages = null;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(router, route, service);
    }

}
