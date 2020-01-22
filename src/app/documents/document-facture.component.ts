import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentDétail } from './document-detail';
import { PageDef } from '../commun/page-def';
import { DocumentPages } from './document-pages';
import { DocumentCommande } from './document-commande';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../modeles/site/site.service';
import { DocumentService } from './document.service';
import { DocumentComponent } from './document.component';
import { IKfVueTableColonneDef } from '../commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { DocumentProduit } from './document-produit';
import { DocumentFacture } from './document-facture';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
    styleUrls: ['../commun/commun.scss']
})
export class DocumentFactureComponent extends DocumentComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = DocumentPages.facture;
    pageDef: PageDef = DocumentPages.facture;

    get document(): DocumentFacture {
        return this._document as DocumentFacture;
    }

    constructor(
        protected route: ActivatedRoute,
        protected _service: DocumentService,
        protected _siteService: SiteService,
    ) {
        super(route, _service, _siteService);
    }

    colonneDefs(): IKfVueTableColonneDef<DocumentProduit>[] {
        return this.utile.colonne.facture();
    }
}

