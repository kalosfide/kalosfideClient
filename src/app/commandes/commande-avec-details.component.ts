import { ActivatedRoute } from '@angular/router';

import { Site } from '../modeles/site/site';
import { PageTableComponent } from '../disposition/page-table/page-table.component';
import { Identifiant } from '../securite/identifiant';
import { RouteurService } from 'src/app/services/routeur.service';
import { DetailCommande } from './detail-commande';
import { Commande } from './commande';
import { Client } from '../modeles/client/client';
import { ICommandeComponent } from './i-commande-component';
import { CommandeUtile } from './commande-utile';
import { IKeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { Produit } from '../modeles/catalogue/produit';
import { CommandeService } from './commande.service';

export abstract class CommandeAvecDetailComponent extends PageTableComponent<DetailCommande> implements ICommandeComponent {

    abstract get titre(): string;

    site: Site;
    identifiant: Identifiant;

    protected _commande: Commande;
    client: Client;

    get ikeyCommande(): IKeyUidRnoNo { return this._commande.apiCommande; }

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommandeService,
    ) {
        super(route, _service);
    }

    get routeur(): RouteurService { return this._service.routeur; }
    get service(): CommandeService { return this._service; }
    get _utile(): CommandeUtile { return this._service.utile; }

    abstract créeDétails(produits: Produit[]): DetailCommande[];

}
