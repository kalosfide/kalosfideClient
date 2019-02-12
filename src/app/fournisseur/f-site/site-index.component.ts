import { Component, OnInit } from '@angular/core';
import { KeyUidRnoIndexComponent } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-index.component';
import { Site } from 'src/app/modeles/site';
import { PageDef } from 'src/app/commun/page-def';
import { FSitePages, FSiteRoutes } from './f-site-pages';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Router, ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/modeles/site.service';
import { KfVueCelluleDef } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
    styles: []
})
export class SiteIndexComponent extends KeyUidRnoIndexComponent<Site> implements OnInit {

    static _pageDef: PageDef = FSitePages.edite;
    pageDef: PageDef = FSitePages.edite;

    dataPages = FSitePages;
    dataRoutes = FSiteRoutes;

    site: null;

    vueTableDef = {
        enTetesDef: [{ texte: 'Nom' }, { texte: 'Titre' }],
        cellules: (ligne: Site): KfVueCelluleDef[] => {
            return [ligne.nomSite, ligne.titre];
        },
        commandes: (ligne: Site): KfComposant[] => {
            return [
                this.créeLienEdite(ligne),
                this.créeLienSupprime(ligne),
            ];
        }
    };

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteService,
    ) {
        super(router, route, service);
    }

    get sites(): Site[] { return this.liste as Site[]; }

    ngOnInit() {
        this.ngOnInit_Charge();
    }

}
