import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { KfTexte } from '../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { KfBouton } from '../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton } from '../commun/kf-composants/kf-composants-types';
import { KfLien } from '../commun/kf-composants/kf-elements/kf-lien/kf-lien';

import { ApiResult } from '../commun/api-results/api-result';

import { SiteInfoService } from './site-info.service';
import { Title } from '@angular/platform-browser';
import { AttenteAsyncService } from '../services/attenteAsync.service';
import { TitreHtmlService } from '../services/titreHtml.service';

import { SiteInfoALESComponent } from './site-info-ales.component';
import { DataApiRoutes } from '../commun/data-par-key/data-api-routes';

@Component({
    templateUrl: '../disposition/page-base/page-base.component.html',
    styles: []
})
export class SiteInfoAjouteComponent extends SiteInfoALESComponent {

    action = DataApiRoutes.Api.ajoute;

    nom = 'siteinfo_ajout';
    titreHtml = 'Siteinfo - ajout';
    titre = 'Ajouter un nouveau site';

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteInfoService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);

        this.boutonsDeFormulaire = [this.créeBoutonSoumettreAsync('Ajouter')];

        this.lienRetour = new KfLien('lienRetour', '..', 'Retour à la liste');

        this.titreRésultatErreur = 'Ajout impossible';
    }

    get siteInfoService(): SiteInfoService {
        return this.service as SiteInfoService;
    }

}
