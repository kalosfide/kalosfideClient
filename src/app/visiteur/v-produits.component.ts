import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageDef } from '../commun/page-def';
import { ProduitIndexBaseComponent } from '../modeles/catalogue/produit-index-base.component';
import { ActivatedRoute } from '@angular/router';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { VisiteurPages } from './visiteur-pages';

@Component({
    templateUrl: '../disposition/page-base/page-base.html', styleUrls: ['../commun/commun.scss']
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
        protected route: ActivatedRoute,
        protected _service: ProduitService,
    ) {
        super(route, _service);
    }

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
    }

}
