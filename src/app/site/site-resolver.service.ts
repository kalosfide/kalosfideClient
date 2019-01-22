import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteurService } from '../services/routeur.service';
import { Observable, of, EMPTY } from 'rxjs';
import { Site } from '../modeles/site';
import { AppPages } from '../app-pages';
import { take, mergeMap } from 'rxjs/operators';
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
        return this._siteService.trouveParNom(nomSite)
            .pipe(
                take(1),
                mergeMap(
                apiResult => {
                    if (apiResult.statusCode === ApiResult200Ok.code) {
                        const site = (apiResult as ApiResult200Ok<Site>).lecture;
                        if (site) {
                            this._navigation.siteEnCours = site;
                            return of(site);
                        }
                    }
                    this._routeur.navigue([AppPages.introuvable.urlSegment]);
                    return EMPTY;
                }
            ));
    }

}
