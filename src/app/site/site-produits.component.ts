import { Component, OnInit, OnDestroy } from '@angular/core';
import { SitePages } from './site-pages';
import { PageDef } from '../commun/page-def';
import { ProduitIndexBaseComponent } from '../produits/produit-index-base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitService } from '../modeles/produit.service';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class SiteProduitsComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = SitePages.produits;
    pageDef: PageDef = SitePages.produits;

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
