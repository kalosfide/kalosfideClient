import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CommandeProduitResolverService } from 'src/app/commandes/commande-produit-resolver.service';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { CommanderService } from './commander.service';
import { RouteurService } from 'src/app/services/routeur.service';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { CommandeRoutes } from './commander-pages';

@Injectable()
export class CommanderProduitResolverService extends CommandeProduitResolverService implements Resolve<Produit> {
    pageDefErreur = CommandePages.liste;
    routesErreur = CommandeRoutes;

    constructor(
        protected _service: CommanderService,
        protected _routeur: RouteurService,
    ) {
        super(_service, _routeur);
    }

}
