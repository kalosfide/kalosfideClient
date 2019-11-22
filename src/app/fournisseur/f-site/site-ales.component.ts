import { ActivatedRoute } from '@angular/router';
import { Site } from 'src/app/modeles/site';
import { SiteService } from 'src/app/modeles/site.service';
import { SiteEditeur } from './site-editeur';
import { FSitePages, FSiteRoutes } from './f-site-pages';
import { KeyUidRnoALESComponent } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-ales.component';

export abstract class SiteALESComponent extends KeyUidRnoALESComponent<Site> {

    site: null;

    dataPages = FSitePages;
    dataRoutes = FSiteRoutes;

    constructor(
        protected route: ActivatedRoute,
        protected _service: SiteService,
    ) {
        super(route, _service);
    }

    get service(): SiteService {
        return this._service;
    }

    créeDataEditeur()  {
        this.dataEditeur = new SiteEditeur();
    }
}
