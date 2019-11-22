import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute, Router } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { ILivraisonComponent } from './i-livraison-component';
import { LivraisonCommandeComponent } from './livraison-commande.component';
import { LivraisonPages } from './livraison-pages';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonCommandeApercuComponent extends LivraisonCommandeComponent implements OnInit, OnDestroy, ILivraisonComponent {

    static _pageDef: PageDef = LivraisonPages.apercu;
    pageDef: PageDef = LivraisonPages.apercu;

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
    ) {
        super(route, _service);
        this.modeTableInitial = ModeTable.aperçu;
    }
}
