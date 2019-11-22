import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { CommanderService } from './commander.service';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { CommandeComponent } from 'src/app/commandes/commande.component';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { Client } from 'src/app/modeles/clientele/client';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { ICommanderComponent } from './i-commander-component';
import { CommandeUtile } from 'src/app/commandes/commande-utile';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CommanderCommandeComponent extends CommandeComponent implements OnInit, OnDestroy, ICommanderComponent {

    static _pageDef: PageDef = CommandePages.liste;
    pageDef: PageDef = CommandePages.liste;

    get titre(): string {
        return `${this.pageDef.titre}${this._commande ? ' n° ' + this._commande.no : ''}`;
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

    protected créeColonneDefs(): IKfVueTableColonneDef<DetailCommande>[] {
        return this._utile.colonne.détail.defsClient();
    }
}
