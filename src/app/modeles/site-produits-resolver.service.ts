import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Produit } from './produit';
import { ProduitService } from './produit.service';
import { KeyUidRnoNoResolverService } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { KeyUidRnoNoService } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { RouteurService } from '../services/routeur.service';

@Injectable()
export class SiteProduitsResolverService extends KeyUidRnoNoResolverService<Produit> implements Resolve<Produit[]> {

    constructor(
        private _routeur: RouteurService,
        private _produitService: ProduitService,
    ) {
        super();
    }


    get routeur(): RouteurService {
        return this._routeur;
    }
    get service(): KeyUidRnoNoService<Produit> { return this._produitService; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Produit[]> {
        return this.résoudListe(route, this.keySiteEnCours(route));
    }

}
