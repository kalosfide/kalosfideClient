import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { DetailCommande } from './detail-commande';
import { Commande } from './commande';
import { ICommandeStock } from './i-commande-stock';
import { CommandeService } from './commande.service';
import { Client } from '../modeles/client/client';
import { ICommandeComponent } from './i-commande-component';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CommandeAvecDetailComponent } from './commande-avec-details.component';
import { ApiCommande } from './api-commande';
import { Produit } from '../modeles/catalogue/produit';
import { IGroupeTableDef } from '../disposition/page-table/groupe-table';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { BarreTitre } from '../disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';

export abstract class CommandeChoixProduitComponent extends CommandeAvecDetailComponent implements OnInit, OnDestroy, ICommandeComponent {

    abstract get titre(): string;

    private _stock: ICommandeStock;


    constructor(
        protected route: ActivatedRoute,
        protected _service: CommandeService,
    ) {
        super(route, _service);
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            boutonsPourBtnGroup: [[], [Fabrique.lien.boutonAnnuler(this._utile.url.commande())]]
        });

        return barre;
    }

    créeGroupeTableDef(): IGroupeTableDef<DetailCommande> {
        const outils = Fabrique.vueTable.outils<DetailCommande>(this.nom);
        outils.ajoute(this._utile.outils.catégorie());
        outils.ajoute(this._utile.outils.produit());

        const vueTableDef: IKfVueTableDef<DetailCommande> = {
            colonnesDef: this._utile.colonne.détail.defsChoixProduit(),
            outils: outils,
            id: (détail: DetailCommande) => this._utile.url.id('' + détail.produit.no),
            quandClic: (détail: DetailCommande) => (() => this.routeur.navigueUrlDef(this._utile.url.ajoute(détail))).bind(this)
        };
        return {
            vueTableDef: vueTableDef
        };
    }

    abstract créeUnDétail(apiCommande: ApiCommande, produit: Produit, client: Client): DetailCommande;

    créeDétails(produits: Produit[]): DetailCommande[] {
        const apiCommande = this._commande.apiCommande;
        const détails = produits
            .filter(p => apiCommande.details.find(d => d.no === p.no) === undefined)
            .map(d => this.créeUnDétail(apiCommande, produits.find(p => p.no === d.no), this.client));
        return détails;
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        this._stock = data.stock;
        this.client = data.client; // résolu si l'utilisateur est le fournisseur
        const apiCommande = this._service.commandeStockée(this._stock, this.client);
        this._commande = new Commande(apiCommande, this.client);
        this._commande.détails = this.créeDétails(this._stock.catalogue.produits);
        this.liste = this._commande.détails;
    }

    créeSuperGroupe() {
        this.créeGroupe('super');
    }

    protected chargeGroupe() {
        this._utile.outils.chargeCatégories(this.vueTable, this._stock.catalogue.catégories);
        this._chargeVueTable(this._commande.détails);
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.service.utile.url.initialiseRouteDétail({ client: this.client }),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
