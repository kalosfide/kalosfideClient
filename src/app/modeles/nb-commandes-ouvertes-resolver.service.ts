import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { KeyUidRnoNoResolverService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { ApiCommande } from '../commandes/api-commande';
import { NbCommandesOuvertesService } from './nb-commandes-ouvertes.service';

@Injectable()
export class NbCommandesOuvertesResolverService extends KeyUidRnoNoResolverService<ApiCommande> implements Resolve<number> {

    constructor(
        private _routeur: RouteurService,
        private _service: NbCommandesOuvertesService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this._routeur; }
    get service(): NbCommandesOuvertesService { return this._service; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<number> {
        const key = this.keySiteEnCours(route);
        return this.service.nbOuvertes(key);
    }

}
