import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from '../services/navigation.service';
import { IdentificationService } from './identification.service';
import { RouteurService } from '../services/routeur.service';
import { SiteRoutes, SitePages } from '../site/site-pages';
import { AppPages } from '../app-pages';

@Injectable({
    providedIn: 'root',
})
export class SiteOuvertGarde implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        private navigation: NavigationService,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.navigation.siteEnCours;
        if (site && !site.ouvert) {
            this.routeur.navigue([AppPages.pasOuvert.urlSegment]);
            return false;
        }
        return true;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
