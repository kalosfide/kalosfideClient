import { Component, OnInit, OnDestroy } from '@angular/core';

import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { LivraisonPages, LivraisonRoutes } from './livraison-pages';
import { ActivatedRoute } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { LivraisonDetailComponent } from './livraison-detail.component';
import { PageDef } from 'src/app/commun/page-def';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonDetailProduitComponent extends LivraisonDetailComponent implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {
    static _pageDef: PageDef = LivraisonPages.produit;
    pageDef: PageDef = LivraisonPages.produit;

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, _service, peutQuitterService);
    }

    protected initialiseUtile() {
        this.service.utile.url.initialiseRouteDétail({ produit: this.produit });
    }
}
