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
        return this._service.stock$().pipe(
            map((stock: ICommandeStock) => {
                const noString: string = route.paramMap.get('no');
                if (noString) {
                    const produit: Produit = stock.catalogue.produits.find(p => p.no === +noString);
                    if (produit) {
                        produit.nomCategorie = stock.catalogue.catégories.find(c => produit.categorieNo === c.no).nom;
                        return produit;
                    }
                }
                const site = this._service.navigation.litSiteEnCours();
                this._routeur.naviguePageDef(this.pageDefErreur, this.routesErreur, site.nomSite);
            })
        );
    }

}
