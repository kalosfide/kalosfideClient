import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommanderService } from './commander.service';
import { CommandeChoixProduitComponent } from 'src/app/commandes/commande-choix-produit.component';
import { PageDef } from 'src/app/commun/page-def';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { Client } from 'src/app/modeles/client/client';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { ICommanderComponent } from './i-commander-component';
import { CommandeUtile } from 'src/app/commandes/commande-utile';
import { CommanderPages } from './commander-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CommanderChoixProduitComponent extends CommandeChoixProduitComponent implements OnInit, OnDestroy, ICommanderComponent {
    static _pageDef: PageDef = CommanderPages.choixProduit;
    pageDef: PageDef = CommanderPages.choixProduit;

    get titre(): string {
        return this.pageDef.titre;
    }

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommanderService,
    ) {
        super(route, _service);
    }

    get service(): CommanderService { return this._service; }
    get utile(): CommandeUtile { return this._utile as CommandeUtile; }

    créeUnDétail(apiCommande: ApiCommande, produit: Produit, client: Client): DetailCommande {
        return new DetailCommande(apiCommande, produit, { client: client });
    }

}
