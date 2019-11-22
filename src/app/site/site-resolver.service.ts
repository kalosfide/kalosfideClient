import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteurService } from '../services/routeur.service';
import { Observable, of, EMPTY } from 'rxjs';
import { Site } from '../modeles/site';
import { AppPages } from '../app-pages';
import { take, mergeMap, tap } from 'rxjs/operators';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { SiteService } from '../modeles/site.service';
import { NavigationService } from '../services/navigation.service';


@Injectable()
export class SiteResolverService implements Resolve<Site> {

    constructor(
        private _routeur: RouteurService,
        private _siteService: SiteService,
        private _navigation: NavigationService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Site> {
        const nomSite = route.paramMap.get('nomSite');
        if (!nomSite) {
            return EMPTY;
        }
        return this._siteService.trouveParNom(nomSite).pipe(
            tap(site => this._navigation.fixeSiteEnCours(site))
        );
    }

}
