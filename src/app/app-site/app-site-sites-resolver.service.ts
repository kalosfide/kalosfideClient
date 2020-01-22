import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { Site } from 'src/app/modeles/site/site';
import { SiteService } from 'src/app/modeles/site/site.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { RouteurService } from '../services/routeur.service';

@Injectable()
export class SitesResolverService extends DataResolverService implements Resolve<Site[]> {

    constructor(
        private _routeur: RouteurService,
        private _service: SiteService,
    ) {
        super();
    }

    get routeur(): RouteurService {
        return this._routeur;
    }
    get service(): SiteService {
        return this._service;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Site[]> {
        return this.service.objet<Site[]>(this._service.liste());
    }

}
