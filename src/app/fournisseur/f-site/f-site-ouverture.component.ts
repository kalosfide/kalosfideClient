import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute, Data } from '@angular/router';

import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { SiteService } from 'src/app/modeles/site.service';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { ProduitService } from 'src/app/modeles/produit.service';
import { FSitePages } from './f-site-pages';
import { SoumissionDef } from 'src/app/disposition/formulaire/i-formulaire';
import { FormulairesComponent } from 'src/app/disposition/formulaire/formulaires.component';
import {
    FermerDef, EnTeteOuvertDef, ArrêterCommandesDef,
    EnTeteFerméDef, ProlongeDef, OuvreDef
} from './f-site-ouverture.soumissions';
import { AlerteService } from 'src/app/disposition/alerte/alerte-service';
import { AlerteSiteFerme, ALERTE_SITE_FERME_ID } from 'src/app/disposition/alerte/alerte-site-ferme';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';

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
    get nomSiteDef(): KfTexteDef {
        return () => this.site.nomSite;
    }

    soumissions: SoumissionDef[];

    constructor(
        protected attenteAsyncService: AttenteAsyncService,
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
        private siteService: SiteService,
        private alerteService: AlerteService,
    ) {
        super(service, attenteAsyncService);
    }

    créeSoumissionsOuvert(commandesEnCours: number) {
        const enTete = new EnTeteOuvertDef();
        const fermer = new FermerDef();
        let arrêter: ArrêterCommandesDef;
        if (commandesEnCours > 0) {
            arrêter = new ArrêterCommandesDef(this.nomSiteDef);
            this.soumissions = [enTete, arrêter, fermer];
        } else {
            this.soumissions = [enTete, fermer];
        }
        fermer.soumission = (): Observable<ApiResult> => {
            return this.siteService.ferme(this.site, fermer.dateRéouverture);
        };
        fermer.actionSiOk = () => {
            this.créeSoumissionsFermé();
            this.alerteService.ajoute(AlerteSiteFerme(this.site));
        };
        this.créeFormulaires();
        if (commandesEnCours > 0) {
            arrêter.fixeTitre(commandesEnCours);
        }
    }

    créeSoumissionsFermé() {
        const enTete = new EnTeteFerméDef(this.nomSiteDef);
        const prolonge = new ProlongeDef();
        const ouvre = new OuvreDef();
        this.soumissions = [enTete, ouvre, prolonge];
        prolonge.soumission = (): Observable<ApiResult> => {
            return this.siteService.ferme(this.site, prolonge.dateRéouverture);
        };
        prolonge.actionSiOk = () => {
            enTete.fixeDate(this.site.etat === 'A' ? this.site.dateEtat : null);
        };
        ouvre.soumission = (): Observable<ApiResult> => {
            return this.siteService.ouvre(this.site);
        };
        ouvre.actionSiOk = () => {
            this.créeSoumissionsOuvert(0);
            this.alerteService.supprime(ALERTE_SITE_FERME_ID);
        };
        this.créeFormulaires();
        enTete.fixeDate(this.site.etat === 'A' ? this.site.dateEtat : null);
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;

        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                const commandesEnCours = data.commandesEnCours;
                if (this.site.ouvert) {
                    this.créeSoumissionsOuvert(commandesEnCours);
                } else {
                    this.créeSoumissionsFermé();
                }
            }));
    }

}
