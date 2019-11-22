import { Component, OnInit, OnDestroy } from '@angular/core';

import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute, RouterStateSnapshot, Data } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { LivraisonDetailCommandeComponent } from './livraison-detail-commande.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonDetailSupprimeComponent extends LivraisonDetailCommandeComponent
    implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {
    static _pageDef: PageDef = CommandePages.supprime;
    pageDef: PageDef = CommandePages.supprime;

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, _service, peutQuitterService);
        this.suppression = true;
    }
}
