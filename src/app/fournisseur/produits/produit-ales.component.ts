import { Router, ActivatedRoute, Data } from '@angular/router';

import { ProduitRoutes, ProduitPages } from './produit-pages';
import { DataKeyALESComponent } from 'src/app/commun/data-par-key/data-key-ales.component';
import { Produit } from 'src/app/modeles/produit';
import { OnInit } from '@angular/core';
import { Site } from 'src/app/modeles/site';
import { ProduitService } from 'src/app/modeles/produit.service';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ProduitEditeur } from './produit-editeur';

export abstract class ProduitALESComponent extends DataKeyALESComponent<Produit> implements OnInit {

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;

    dataPages = ProduitPages;
    dataRoutes = ProduitRoutes;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
        protected attenteAsyncService: AttenteAsyncService,
        protected navigationService: NavigationService,
    ) {
        super(router, route, service, attenteAsyncService);
        this.chargeData = (data: Data) => {
            this.editeur.chargeCategories(data.categories);
        };
    }

    créeDataEditeur() {
        this.dataEditeur = new ProduitEditeur();
    }

    get editeur(): ProduitEditeur {
        return this.dataEditeur as ProduitEditeur;
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        this.créeFormulaire();
        this.ngOnInit_Charge();
    }

}
