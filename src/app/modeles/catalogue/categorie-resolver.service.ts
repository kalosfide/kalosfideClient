import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { KeyUidRnoNoResolverService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { Categorie } from './categorie';
import { RouteurService } from 'src/app/services/routeur.service';
import { CategorieService } from './categorie.service';
import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { mergeMap } from 'rxjs/operators';
import { ApiResult404NotFound } from 'src/app/commun/api-results/api-result-404-not-found';

@Injectable()
export class CategorieResolverService extends KeyUidRnoNoResolverService<Categorie> implements Resolve<Categorie> {

    constructor(
        private _routeur: RouteurService,
        private _categorieService: CategorieService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this._routeur; }
    get service(): KeyUidRnoNoService<Categorie> { return this._categorieService; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Categorie | Observable<Categorie> {
        const no: number = +route.paramMap.get('no');
        return this._categorieService.catégorie$(no).pipe(
            mergeMap(catégorie => {
                if (catégorie) {
                    return of(catégorie);
                } else {
                    this._routeur.navigueVersErreur(new ApiResult404NotFound());
                    return EMPTY;
                }
            })
        );
    }

}
