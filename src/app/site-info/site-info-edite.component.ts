import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
export class SiteInfoEditeComponent extends SiteInfoALESComponent {

    action = DataApiRoutes.Api.edite;

    nom = 'siteinfo_';
    titreHtml = 'Siteinfo - ';
    titre = 'Editer le site';

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteInfoService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);

        this.titreRésultatErreur = 'Mise à jour impossible';
    }

}
