import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

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
export class SiteInfoSupprimeComponent extends SiteInfoALESComponent implements OnInit, OnDestroy {

    action = DataApiRoutes.Api.supprime;

    nom = 'siteinfo_supprime';
    titreHtml = 'Siteinfo - Supprime';
    titre = 'Supprimer le site';

    subscription: Subscription;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteInfoService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);


        this.titreRésultatErreur = 'Suppression impossible';
    }

    ngOnInit() {
        this.ngOnInit_TitreHtml();
        this.ngOnInit_CréeFormulaire();
        this.ngOnInit_Charge();
        this.edition.désactive();
    }

    get siteInfoService(): SiteInfoService {
        return this.service as SiteInfoService;
    }

}
