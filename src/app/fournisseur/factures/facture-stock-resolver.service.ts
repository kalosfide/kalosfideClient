import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { FactureService } from './facture.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { FactureStock } from './facture-stock';

@Injectable()
export class FactureStockResolverService implements Resolve<FactureStock> {

    constructor(
        private _routeur: RouteurService,
        private _service: FactureService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FactureStock> {
        const site = this._service.navigation.litSiteEnCours();
        return this._service.stock$();
    }
}

@Injectable()
export class FactureRésoluResolverService extends DataResolverService implements Resolve<FactureStock> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): FactureStock | Observable<FactureStock> {
        const résolu: FactureStock = this.résolu(route, 'stock');
        if (résolu) {
            return résolu;
        } else {
            throw new Error('FactureRésoluResolverService: FactureStockResolverService doit avoir déjà résolu le stock');
        }
    }
}
