import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { LivraisonService } from './livraison.service';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { CommandeProduitResolverService } from 'src/app/commandes/commande-produit-resolver.service';
import { RouteurService } from 'src/app/services/routeur.service';
import { LivraisonPages, LivraisonRoutes } from './livraison-pages';

@Injectable()
export class LivraisonProduitResolverService extends CommandeProduitResolverService implements Resolve<Produit> {
    pageDefErreur = LivraisonPages.produits;
    routesErreur = LivraisonRoutes;

    constructor(
        protected _service: LivraisonService,
        protected _routeur: RouteurService,
    ) {
        super(_service, _routeur);
    }

}

@Injectable()
export class LivraisonProduitRésoluResolverService extends DataResolverService implements Resolve<Produit> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Produit> {
        return this.résolu(route, 'produit');
    }

}
