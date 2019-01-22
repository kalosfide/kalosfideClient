import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Categorie } from './categorie';
import { CategorieService } from './categorie.service';
import { KeyUidRnoNoResolverService } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { KeyUidRnoNoService } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { RouteurService } from '../services/routeur.service';

@Injectable()
export class SiteCategoriesResolverService extends KeyUidRnoNoResolverService<Categorie> implements Resolve<Categorie[]> {

    constructor(
        private _routeur: RouteurService,
        private _categorieService: CategorieService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this._routeur; }
    get service(): KeyUidRnoNoService<Categorie> { return this._categorieService; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Categorie[]> {
        return this.résoudListe(route, this.keySiteEnCours(route));
    }

}
