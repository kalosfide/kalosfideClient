import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KeyUidRnoNoResolverService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { Produit } from 'src/app/modeles/produit';
import { ProduitService } from 'src/app/modeles/produit.service';
import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { RouteurService } from 'src/app/services/routeur.service';

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

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Produit> {
        const site = this.service.navigation.siteEnCours;
        return this.résoudObjet(route, {
            uid: site.uid,
            rno: site.rno,
            no: +route.paramMap.get('no')
        });
    }

}
