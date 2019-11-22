import { OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { CommanderStock } from './commander';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { CommanderService } from './commander.service';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { DetailCommandeComponent } from 'src/app/commandes/detail-commande.component';
import { ITitrePage } from 'src/app/disposition/titre-page/titre-page';
import { ICommanderComponent } from './i-commander-component';
import { CommandeUtile } from 'src/app/commandes/commande-utile';

export abstract class CommanderDetailComponent extends DetailCommandeComponent
    implements OnInit, OnDestroy, ComponentAAutoriserAQuitter, ICommanderComponent {

    get titre(): string {
        return this.pageDef.titre;
    }

    get titrePage(): ITitrePage {
        return {
            titre: this.titre,
            niveau: 1,
        };
    }

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommanderService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, _service, peutQuitterService);
    }

    get service(): CommanderService { return this._service; }

    get utile(): CommandeUtile {
        return this.service.utile;
    }

    créeDétail(data: Data): DetailCommande {
        const stock: CommanderStock = data.stock;
        const produit = data.produit;
        return new DetailCommande(stock.commande, produit);
    }
}
