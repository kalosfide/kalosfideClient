import { Injectable } from '@angular/core';
import { Router, CanActivateChild, CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProduitRoutes } from '../fournisseur/produits/produit-pages';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation.service';
import { SiteService } from 'src/app/modeles/site.service';
import { RouteurService } from '../services/routeur.service';
import { AppPages } from '../app-pages';

@Injectable({
    providedIn: 'root',
})
/**
 * sur une route déjà gardée par FournisseurGarde
 * redirige vers l'accueil des produits si le site est ouvert
 */
export class SitePasOuvertGarde implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        private navigation: NavigationService,
        private service: SiteService,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.navigation.siteEnCours;
        if (!site || site.ouvert) {
            this.routeur.navigue([AppPages.interdit.urlSegment]);
            return false;
        }
        return true;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
