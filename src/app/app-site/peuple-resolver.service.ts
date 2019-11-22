import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { RouteurService } from '../services/routeur.service';
import { PeupleService } from './peuple.service';

@Injectable()
export class PeupleResolverService extends DataResolverService implements Resolve<boolean> {

    constructor(
        private _routeur: RouteurService,
        private _service: PeupleService,
    ) {
        super();
    }

    get routeur(): RouteurService {
        return this._routeur;
    }
    get service(): PeupleService {
        return this._service;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<boolean> {
        return this.service.estPeuplé();
    }

}
