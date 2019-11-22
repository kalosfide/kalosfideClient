import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { MotDePasseService } from './mot-de-passe.service';
import { ReglesDeMotDePasse } from './mot-de-passe';
import { RouteurService } from 'src/app/services/routeur.service';

@Injectable()
export class MotDePasseResolverService extends DataResolverService implements Resolve<ReglesDeMotDePasse> {

    constructor(
        private _routeur: RouteurService,
        private _service: MotDePasseService,
    ) {
        super();
    }

    get routeur(): RouteurService {
        return this._routeur;
    }
    get service(): MotDePasseService {
        return this._service;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<ReglesDeMotDePasse> {
        return this._service.chargeRègles();
    }

}
