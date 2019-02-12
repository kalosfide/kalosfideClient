import { Router, ActivatedRoute } from '@angular/router';
import { DataKeyALESComponent } from 'src/app/commun/data-par-key/data-key-ales.component';
import { Site } from 'src/app/modeles/site';
import { SiteService } from 'src/app/modeles/site.service';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { SiteEditeur } from './site-editeur';
import { FSitePages, FSiteRoutes } from './f-site-pages';

export abstract class SiteALESComponent extends DataKeyALESComponent<Site> {

    site: null;

    dataPages = FSitePages;
    dataRoutes = FSiteRoutes;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, attenteAsyncService);
    }

    créeDataEditeur()  {
        this.dataEditeur = new SiteEditeur();
    }
}
