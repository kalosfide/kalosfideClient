import { Component, OnInit, OnDestroy } from '@angular/core';

import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { LivraisonDetailCommandeComponent } from './livraison-detail-commande.component';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { ITitrePage } from 'src/app/disposition/titre-page/titre-page';
import { BarreTitre, IBarreDef } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonDetailAjouteComponent extends LivraisonDetailCommandeComponent
    implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {
    static _pageDef: PageDef = CommandePages.ajoute;
    pageDef: PageDef = CommandePages.ajoute;

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
