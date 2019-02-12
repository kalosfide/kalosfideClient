import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from './navigation.service';
import { Site } from '../modeles/site';
import { SiteRoutes, ISiteRoutes } from '../site/site-pages';
import { AppSiteRoutes } from '../app-site/app-site-pages';
import { PageDef } from '../commun/page-def';
import { AppRoutes } from '../app-pages';
import { Identifiant } from '../securite/identifiant';
import { FournisseurRoutes } from '../fournisseur/fournisseur-pages';
import { ClientRoutes } from '../client/client-pages';
import { VisiteurRoutes } from '../visiteur/visiteur-pages';

@Injectable({
    providedIn: 'root'
})
export class RouteurService {
    erreurDeRoute: string;

    constructor(
        public router: Router,
        public identification: IdentificationService,
        public navigation: NavigationService,
    ) { }

    routesSite(nomSite: string, identifiant: Identifiant): ISiteRoutes {
        if (nomSite) {
            return identifiant
                ? identifiant.estFournisseurDeNomSite(nomSite)
                    ? FournisseurRoutes
                    : identifiant.estUsagerDeNomSite(nomSite)
                        ? ClientRoutes
                        : VisiteurRoutes
                : VisiteurRoutes;
        }
    }

    url(segments?: string[]): string {
        const site: Site = this.navigation.siteEnCours;
        const identifiant = this.identification.litIdentifiant();
        return site
            ? SiteRoutes.urlSite(site.nomSite, identifiant, segments)
            : AppSiteRoutes.url(segments);
    }

    navigue(segments?: string[]) {
        this.router.navigate([this.url(segments)]);
    }

    navigate(routes: any[]) {
        this.router.navigate(routes);
    }

    naviguePageDef(pageDef?: PageDef, routes?: ISiteRoutes, nomSite?: string) {
        if (pageDef) {
            this.router.navigate([nomSite ? routes.url(nomSite, [pageDef.urlSegment]) : AppRoutes.url([pageDef.urlSegment])]);
        } else {
            this.router.navigate([nomSite ? routes.url(nomSite) : AppRoutes.url()]);
        }
    }

}
