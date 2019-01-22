import { Injectable } from '@angular/core';
import { Router, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProduitRoutes } from './produit-pages';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation.service';
import { SiteService } from 'src/app/modeles/site.service';

@Injectable({
    providedIn: 'root',
})
/**
 * sur une route déjà gardée par FournisseurGarde
 * redirige vers l'accueil des produits si le site est ouvert
 */
export class SitePasOuvertGarde implements CanActivateChild {

    constructor(
        private router: Router,
        private navigation: NavigationService,
        private service: SiteService,
    ) {
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const site = this.navigation.siteEnCours;
        return this.service.ouvert(site).pipe(
            map(ouvert => {
                if (ouvert) {
                    this.router.navigate([ProduitRoutes.url(site.nomSite)]);
                    return false;
                }
                return true;
            })
        );
    }
}
