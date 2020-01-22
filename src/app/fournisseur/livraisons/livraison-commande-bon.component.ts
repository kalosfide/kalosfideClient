import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute, Router } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { ILivraisonComponent } from './i-livraison-component';
import { LivraisonCommandeComponent } from './livraison-commande.component';
import { LivraisonPages } from './livraison-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonCommandeBonComponent extends LivraisonCommandeComponent implements OnInit, OnDestroy, ILivraisonComponent {

    static _pageDef: PageDef = LivraisonPages.liste;
    pageDef: PageDef = LivraisonPages.liste;

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
    ) {
        super(route, _service);
    }
}
