import { Site } from '../modeles/site';
import { NavigationService } from '../services/navigation.service';
import { PageDef } from '../commun/page-def';
import { Router } from '@angular/router';
import { AppSite } from '../app-site/app-site';

export abstract class SiteBaseComponent {
    abstract pageDef: PageDef;
    abstract actionFournisseur: string;
    abstract actionClient: string;

    site: Site;

    get titre(): string {
        return this.pageDef.title;
    }

    constructor(
        protected router: Router,
        protected service: NavigationService,
    ) {
    }

    ngOnInit_Site() {
        this.site = this.service.siteEnCours;
    }

    get siteTitre(): string {
        return this.site.titre;
    }

    get racineTitre(): string {
        return AppSite.nom;
    }

}
