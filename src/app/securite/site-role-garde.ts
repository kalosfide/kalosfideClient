import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPages } from '../app-pages';
import { IdentificationService } from './identification.service';
import { NavigationService } from '../services/navigation.service';
import { RouteurService } from '../services/routeur.service';
import { SiteRoutes } from '../site/site-pages';
import { TypesRoles } from './type-role';

@Injectable({
    providedIn: 'root',
})
export class SiteRoleGarde implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        private identification: IdentificationService,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this.identification.estIdentifié) {
            const identifiant = this.identification.litIdentifiant();

            const x = SiteRoutes.nomSite_typeRole_page(_state.url);
            if (!x) {
                // ce n'est pas une route à garder
                return true;
            }
            const nomSite = x[0];
            const typeRole = x[1];
            switch (typeRole) {
                case TypesRoles.fournisseur:
                    return identifiant.estFournisseurDeNomSite(nomSite);
                case TypesRoles.client:
                    return identifiant.estClientDeNomSite(nomSite);
                case TypesRoles.visiteur:
                    return !identifiant.estUsagerDeNomSite(nomSite);
                default:
                    break;
            }
        }
        this.routeur.navigue([AppPages.interdit.urlSegment]);
        return false;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
