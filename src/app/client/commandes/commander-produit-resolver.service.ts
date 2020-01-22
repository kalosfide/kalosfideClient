import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { CommanderService } from './commander.service';
import { CommanderRoutes, CommanderPages } from './commander-pages';
import { Observable } from 'rxjs';

@Injectable()
export class CommanderProduitResolverService implements Resolve<Produit> {
    pageDefErreur = CommanderPages.liste;
    routesErreur = CommanderRoutes;

    constructor(
        private _service: CommanderService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Produit | Observable<Produit> {
        const noString: string = route.paramMap.get('no');
        return this._service.résoudProduit(noString);
    }

}
