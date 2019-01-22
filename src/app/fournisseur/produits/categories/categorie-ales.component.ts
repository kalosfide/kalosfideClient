import { Router, ActivatedRoute } from '@angular/router';
import { CategorieRoutes, CategoriePages } from './categorie-pages';
import { DataKeyALESComponent } from 'src/app/commun/data-par-key/data-key-ales.component';
import { Categorie } from 'src/app/modeles/categorie';
import { OnInit } from '@angular/core';
import { Site } from 'src/app/modeles/site';
import { CategorieService } from 'src/app/modeles/categorie.service';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { CategorieEditeur } from './categorie-editeur';

export abstract class CategorieALESComponent extends DataKeyALESComponent<Categorie> implements OnInit {

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;

    urlPageIndex: string;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: CategorieService,
        protected attenteAsyncService: AttenteAsyncService,
        protected navigationService: NavigationService,
    ) {
        super(router, route, service, attenteAsyncService);
    }

    créeDataEditeur()  {
        this.dataEditeur = new CategorieEditeur();
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        this.urlPageIndex = CategorieRoutes.url(this.site.nomSite, CategoriePages.index.urlSegment);
        this.créeFormulaire();
        this.ngOnInit_Charge();
    }

}
