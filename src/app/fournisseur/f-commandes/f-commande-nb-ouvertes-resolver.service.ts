import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KeyUidRnoNoResolverService } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { FCommandeLigne, FCommandeDetail } from './f-commande';
import { FCommandeService } from './f-commande.service';
import { RouteurService } from 'src/app/services/routeur.service';
import { map } from 'rxjs/operators';

@Injectable()
export class FCommandeNbOuvertesResolverService extends KeyUidRnoNoResolverService<FCommandeLigne> implements Resolve<number> {

    constructor(
        private _routeur: RouteurService,
        private _service: FCommandeService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this._routeur; }
    get service(): FCommandeService { return this._service; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<number> {
        const key = this.keySiteEnCours(route);
        return this.objet<number>(this.service.nbOuvertes(key));
    }

}
