import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SiteALESComponent } from './site-ales.component';
import { SiteService } from 'src/app/modeles/site.service';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { PageDef } from 'src/app/commun/page-def';
import { FSitePages } from './f-site-pages';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
    styles: []
})
export class SiteEditeComponent extends SiteALESComponent {

    static _pageDef: PageDef = FSitePages.edite;
    pageDef: PageDef = FSitePages.edite;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, attenteAsyncService);

        this.pageDef.titre = 'Editer le site';
        this.titreRésultatErreur = 'Mise à jour impossible';
    }

}
