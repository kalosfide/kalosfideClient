import { Component, OnInit, OnDestroy } from '@angular/core';

import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { LivraisonDetailCommandeComponent } from './livraison-detail-commande.component';
import { IBarreDef } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { LivraisonPages } from './livraison-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonDetailAjouteComponent extends LivraisonDetailCommandeComponent
    implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {
    static _pageDef: PageDef = LivraisonPages.ajoute;
    pageDef: PageDef = LivraisonPages.ajoute;

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, _service, peutQuitterService);
        this.ajout = true;
    }

    get barreTitreDef(): IBarreDef {
        const def = this._barreTitreDef;
        def.boutonsPourBtnGroup = [[this.utile.lien.retourDeAjoute(this.détail)]];
        return def;
    }
}
