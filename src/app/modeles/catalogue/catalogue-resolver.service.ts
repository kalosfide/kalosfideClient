import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Catalogue } from './catalogue';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { CatalogueService } from './catalogue.service';

@Injectable()
export class CatalogueResolverService implements Resolve<Catalogue> {

    constructor(
        private _catalogueService: CatalogueService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Catalogue> {
        return this._catalogueService.catalogue$();
    }

}

@Injectable()
export class CatalogueRésoluResolverService extends DataResolverService implements Resolve<Catalogue> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Catalogue | Observable<Catalogue> {
        const résolu: Catalogue = this.résolu(route, 'catalogue');
        if (résolu) {
            return résolu;
        } else {
            throw new Error('CatalogueRésoluResolverService: CatalogueResolverService doit avoir déjà résolu le catalogue');
        }
    }
}
