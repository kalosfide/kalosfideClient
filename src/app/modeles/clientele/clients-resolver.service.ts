import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { Client } from './client';
import { ClientService } from './client.service';
import { DataResolverService } from '../../services/data-resolver.service';

/**
 * résoud la liste des clients du site en cours
 */
@Injectable()
export class ClientsResolverService implements Resolve<Client[]> {

    constructor(
        private _router: RouteurService,
        private _service: ClientService,
    ) {
    }

    get routeur(): RouteurService { return this._router; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Client[]> {
        return this._service.clients$();
    }

}

@Injectable()
export class ClientsRésoluResolverService extends DataResolverService implements Resolve<Client[]> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client[]> {
        return this.résolu(route, 'clients');
    }
}
