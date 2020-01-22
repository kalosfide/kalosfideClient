import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { map } from 'rxjs/operators';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { CommandeService } from './commande.service';
import { ICommandeStock } from './i-commande-stock';
import { RouteurService } from '../services/routeur.service';
import { PageDef } from '../commun/page-def';
import { ISiteRoutes } from '../site/site-pages';

export abstract class CommandeProduitResolverService {
    abstract pageDefErreur: PageDef;
    abstract routesErreur: ISiteRoutes;

    constructor(
        protected _service: CommandeService,
        protected _routeur: RouteurService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Produit | Observable<Produit> {
        const noString: string = route.paramMap.get('no');
        return this._service.stock$().pipe(
            map((stock: ICommandeStock) => {
                const produit: Produit = this._service.produit(stock, noString);
                if (produit) {
                    return produit;
                }
                const site = this._service.navigation.litSiteEnCours();
                this._routeur.naviguePageDef(this.pageDefErreur, this.routesErreur, site.nomSite);
                return;
            })
        );
    }

}
