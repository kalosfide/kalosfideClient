import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { SiteService } from 'src/app/modeles/site.service';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { ProduitService } from 'src/app/modeles/produit.service';
import { FSitePages } from './f-site-pages';
import { FournisseurRoutes, FournisseurPages } from '../fournisseur-pages';
import { SoumissionDef } from 'src/app/disposition/formulaire/i-formulaire';
import { FormulairesComponent } from 'src/app/disposition/formulaire/formulaires.component';
import { FermerDef, EnTeteOuvertDef, ArrêterCommandesDef,
    EnTeteFerméDef, AllerAuxProduitsDef, ProlongeDef, OuvreDef } from './f-site-ouverture.soumissions';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styles: []
})
export class FSiteOuvertureComponent extends FormulairesComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = FSitePages.ouverture;
    pageDef: PageDef = FSitePages.ouverture;

    get titre(): string {
        return this.pageDef.title;
    }

    site: Site;

    soumissions: SoumissionDef[];

    constructor(
        protected attenteAsyncService: AttenteAsyncService,
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
        private siteService: SiteService,
    ) {
        super(service, attenteAsyncService);
    }

    créeSoumissionsOuvert(commandesEnCours: number) {
        const enTete = new EnTeteOuvertDef();
        const fermer = new FermerDef();
        let arrêter: ArrêterCommandesDef;
        if (commandesEnCours > 0) {
            arrêter = new ArrêterCommandesDef();
            this.soumissions = [enTete, arrêter, fermer];
        } else {
            this.soumissions = [enTete, fermer];
        }
        this.créeFormulaires();
        fermer.soumission = (): Observable<ApiResult> => {
            return this.siteService.ferme(this.site, fermer.dateRéouverture);
        };
        fermer.actionSiOk = () => {
            this.créeSoumissionsFermé();
            this.créeFormulaires();
        };
        if (commandesEnCours > 0) {
            arrêter.fixeTexte(commandesEnCours);
            arrêter.lien.fixeRoute(FournisseurRoutes.url(this.site.nomSite, [FournisseurPages.commandes.urlSegment]));
        } else {
            this.soumissions = [enTete, fermer];
        }
    }

    créeSoumissionsFermé() {
        const enTete = new EnTeteFerméDef();
        const produits = new AllerAuxProduitsDef();
        const prolonge = new ProlongeDef();
        const ouvre = new OuvreDef();
        this.soumissions = [enTete, produits, ouvre];
        this.créeFormulaires();
        enTete.fixeDate(this.site.etat === 'A' ? this.site.dateEtat : null);
        produits.lien.fixeRoute(FournisseurRoutes.url(this.site.nomSite, [FournisseurPages.produits.urlSegment]));
        prolonge.soumission = (): Observable<ApiResult> => {
            return this.siteService.ferme(this.site, new Date());
        };
        prolonge.actionSiOk = () => {
            enTete.fixeDate(this.site.etat === 'A' ? this.site.dateEtat : null);
        };
        ouvre.soumission = (): Observable<ApiResult> => {
            return this.siteService.ouvre(this.site);
        };
        ouvre.actionSiOk = () => {
            this.créeSoumissionsOuvert(0);
            this.créeFormulaires();
        };
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        const commandesEnCours = 5;
        if (this.site.ouvert) {
            this.créeSoumissionsOuvert(commandesEnCours);
        } else {
            this.créeSoumissionsFermé();
        }
    }

}
