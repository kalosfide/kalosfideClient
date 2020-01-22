import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { FactureService } from './facture.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { FactureCommande } from './facture-commande';
import { mergeMap } from 'rxjs/operators';
import { Client } from 'src/app/modeles/client/client';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { ApiResult404NotFound } from 'src/app/commun/api-results/api-result-404-not-found';
import { ApiFactureCommande } from './facture-api';

@Injectable()
export class FactureCommandeResolverService extends DataResolverService implements Resolve<FactureCommande> {

    constructor(
        private _routeur: RouteurService,
        private _service: FactureService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FactureCommande> {
        const no: number = +route.paramMap.get('no');
        const client: Client = this.résolu(route, 'client');
        if (client) {
            return this._service.stock$().pipe(
                mergeMap(stock => {
                    let apiCommande: ApiFactureCommande;
                    const apiFacture = stock.factures.find(f => f.uid === client.uid && f.rno === client.rno);
                    if (apiFacture) {
                        apiCommande = apiFacture.commandes.find(c => c.no === no);
                    }
                    if (apiCommande) {
                        return of(new FactureCommande(apiCommande, client, stock.catalogue));
                    } else {
                        this._routeur.navigueVersErreur(new ApiResult404NotFound());
                        return EMPTY;
                    }
                })
            );
        } else {
            throw new Error('ClientRésoluResolverService: ClientResolverService doit avoir déjà résolu le client');
        }
    }
}
