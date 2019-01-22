import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProduitPrix } from '../../modeles/produit-prix';
import { ProduitPrixService } from './produit-prix.service';
import { KeyUidRnoNoResolverService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { RouteurService } from 'src/app/services/routeur.service';

@Injectable()
export class ProduitPrixResolverService extends KeyUidRnoNoResolverService<ProduitPrix> implements Resolve<ProduitPrix> {

    constructor(
        private _routeur: RouteurService,
        private _produitPrixService: ProduitPrixService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this._routeur; }
    get service(): KeyUidRnoNoService<ProduitPrix> { return this._produitPrixService; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<ProduitPrix> {
        const site = this.service.navigation.siteEnCours;
        return this.résoudObjet(route, {
            uid: site.uid,
            rno: site.rno,
            no: +route.paramMap.get('no')
        });
    }

}
