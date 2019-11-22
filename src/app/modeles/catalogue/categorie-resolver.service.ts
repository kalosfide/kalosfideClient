import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KeyUidRnoNoResolverService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { Categorie } from './categorie';
import { RouteurService } from 'src/app/services/routeur.service';
import { CategorieService } from './categorie.service';
import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { Catalogue } from './catalogue';

@Injectable()
export class CategorieResolverService extends KeyUidRnoNoResolverService<Categorie> implements Resolve<Categorie> {

    constructor(
        private _router: RouteurService,
        private _categorieService: CategorieService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this._router; }
    get service(): KeyUidRnoNoService<Categorie> { return this._categorieService; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Categorie | Observable<Categorie> {
        const catalogue: Catalogue = this.résolu(route, 'catalogue');
        if (!catalogue) {
            throw new Error('CategorieResolverService: CatalogueResolverService doit avoir déjà résolu le catalogue');
        }
        const no: number = +route.paramMap.get('no');
        const catégorie: Categorie = catalogue.catégories.find(c => c.no === no);
        catégorie.nbProduits = catalogue.produits.filter(p => p.categorieNo === catégorie.no).length;
        return catégorie;
    }

}
