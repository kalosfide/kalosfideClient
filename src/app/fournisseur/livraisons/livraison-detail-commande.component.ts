import { OnInit, OnDestroy } from '@angular/core';

import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { LivraisonPages, LivraisonRoutes } from './livraison-pages';
import { ActivatedRoute } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { LivraisonDetailComponent } from './livraison-detail.component';

export abstract class LivraisonDetailCommandeComponent extends LivraisonDetailComponent
    implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, _service, peutQuitterService);
    }
}
