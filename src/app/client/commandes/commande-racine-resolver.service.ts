import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Produit } from '../../modeles/produit';
import { ProduitService } from '../../modeles/produit.service';
import { KeyUidRnoNoResolverService } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { KeyUidRnoNoService } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { CommandeLigne } from './commande-ligne';
import { CommandeService } from './commande.service';
import { CommandeVue, Commande } from './commande';
import { RouteurService } from 'src/app/services/routeur.service';

@Injectable()
export class CommandeRacineResolverService extends KeyUidRnoNoResolverService<Produit> implements Resolve<CommandeVue> {

    constructor(
        private _routeur: RouteurService,
        private _service: CommandeService,
        private _produitService: ProduitService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this._routeur; }
    get service(): KeyUidRnoNoService<Produit> { return this._produitService; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<CommandeVue> {
        const keySite = this.keySiteEnCours(route);
        return forkJoin(
            this.objet<Produit[]>(this._produitService.disponibles(keySite)),
            this.objet<Commande>(this._service.derniereCommande())
        ).pipe(
            map(pn => {
                const produits = pn[0];
                const derniere = pn[1];
                return new CommandeVue(derniere, produits);
            })
        );
    }

}
