import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { LivraisonService } from './livraison.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { LivraisonStock } from './livraison-stock';

@Injectable()
export class LivraisonStockResolverService implements Resolve<LivraisonStock> {

    constructor(
        private _routeur: RouteurService,
        private _service: LivraisonService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LivraisonStock> {
        const site = this._service.navigation.litSiteEnCours();
        return this._service.stock$();
    }
}

@Injectable()
export class LivraisonRésoluResolverService extends DataResolverService implements Resolve<LivraisonStock> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): LivraisonStock | Observable<LivraisonStock> {
        const résolu: LivraisonStock = this.résolu(route, 'stock');
        if (résolu) {
            return résolu;
        } else {
            throw new Error('LivraisonRésoluResolverService: LivraisonStockResolverService doit avoir déjà résolu le stock');
        }
    }
}
