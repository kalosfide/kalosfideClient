import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute, Router } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { ILivraisonComponent } from './i-livraison-component';
import { LivraisonCommandeComponent } from './livraison-commande.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonCommandeBonComponent extends LivraisonCommandeComponent implements OnInit, OnDestroy, ILivraisonComponent {

    static _pageDef: PageDef = CommandePages.liste;
    pageDef: PageDef = CommandePages.liste;

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
    ) {
        super(route, _service);
    }
}
