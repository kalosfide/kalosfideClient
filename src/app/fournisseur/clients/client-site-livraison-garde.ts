import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';
import { RouteurService } from '../../services/routeur.service';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { ClientPages, ClientRoutes } from './client-pages';

@Injectable({
    providedIn: 'root',
})
/**
 * redirige vers l'index des clients si le site est d'état livraison
 */
export class ClientSiteLivraisonGarde implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        private navigation: NavigationService,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.navigation.litSiteEnCours();
        if (site.etat === IdEtatSite.livraison) {
            this.routeur.naviguePageDef(ClientPages.index, ClientRoutes, site.nomSite);
            return false;
        }
        return true;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
