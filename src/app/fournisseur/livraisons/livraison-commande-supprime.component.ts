import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { LivraisonPages } from './livraison-pages';
import { ILivraisonComponent } from './i-livraison-component';
import { LivraisonCommandeComponent } from './livraison-commande.component';
import { ModeAction } from 'src/app/commandes/condition-action';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonCommandeSupprimeComponent extends LivraisonCommandeComponent implements OnInit, OnDestroy, ILivraisonComponent {

    static _pageDef: PageDef = LivraisonPages.annule;
    pageDef: PageDef = LivraisonPages.annule;

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
    ) {
        super(route, _service);
    }

    protected get modeActionInitial(): ModeAction {
        return ModeAction.supprime;
    }
}
