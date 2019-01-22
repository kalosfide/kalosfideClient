import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from './navigation.service';
import { Site } from '../modeles/site';
import { SiteRoutes } from '../site/site-pages';
import { AppSiteRoutes } from '../app-site/app-site-pages';

@Injectable({
    providedIn: 'root'
})
export class RouteurService {
    erreurDeRoute: string;

    constructor(
        public router: Router,
        public identification: IdentificationService,
        public navigation: NavigationService,
    ) {}

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
}
