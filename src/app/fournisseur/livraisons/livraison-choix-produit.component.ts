import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommandeChoixProduitComponent } from 'src/app/commandes/commande-choix-produit.component';
import { LivraisonService } from './livraison.service';
import { PageDef } from 'src/app/commun/page-def';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { Client } from 'src/app/modeles/client/client';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { ILivraisonComponent } from './i-livraison-component';
import { LivraisonPages } from './livraison-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonChoixProduitComponent extends CommandeChoixProduitComponent implements OnInit, OnDestroy, ILivraisonComponent {

    static _pageDef: PageDef = LivraisonPages.choixProduit;
    pageDef: PageDef = LivraisonPages.choixProduit;

    get titre(): string {
        return 'Commander pour ' + this.client.nom + ' - ' + this.pageDef.titre;
    }

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
    ) {
        super(route, _service);
    }

    get service(): LivraisonService { return this._service; }

    créeUnDétail(apiCommande: ApiCommande, produit: Produit, client: Client): DetailCommande {
        return new DetailCommande(apiCommande, produit, { client: client, estDansListeParProduit: true });
    }
}
