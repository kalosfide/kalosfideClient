import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KeyUidRnoNoResolverService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { Produit } from './produit';
import { ProduitService } from './produit.service';
import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { RouteurService } from 'src/app/services/routeur.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { Catalogue } from './catalogue';

@Injectable()
export class ProduitResolverService extends KeyUidRnoNoResolverService<Produit> implements Resolve<Produit> {

    constructor(
        private _routeur: RouteurService,
        private _produitService: ProduitService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this._routeur; }
    get service(): KeyUidRnoNoService<Produit> { return this._produitService; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Produit | Observable<Produit> {
        const catalogue: Catalogue = this.résolu(route, 'catalogue');
        if (!catalogue) {
            throw new Error('ProduitResolverService: CatalogueResolverService doit avoir déjà résolu le catalogue');
        }
        const no: number = +route.paramMap.get('no');
        const produit: Produit = catalogue.produits.find(p => p.no === no);
        produit.nomCategorie = catalogue.catégories.find(c => produit.categorieNo === c.no).nom;
        return produit;
    }

}

@Injectable()
export class ProduitRésoluResolverService extends DataResolverService implements Resolve<Produit> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Produit> {
        return this.résolu(route, 'produit');
    }

}
