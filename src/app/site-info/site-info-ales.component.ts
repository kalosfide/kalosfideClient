import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';


import { SiteInfoService } from './site-info.service';
import { AttenteAsyncService } from '../services/attenteAsync.service';
import { TitreHtmlService } from '../services/titreHtml.service';

import { DataKeyALESComponent } from '../commun/data-par-key/data-key-ales.component';
import { SiteInfo } from './site-info';
import { SiteInfoEditeur } from './site-info-editeur';

export abstract class SiteInfoALESComponent extends DataKeyALESComponent<SiteInfo> {

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteInfoService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);
    }

    créeDataEditeur()  {
        this.dataEditeur = new SiteInfoEditeur();
    }
}
