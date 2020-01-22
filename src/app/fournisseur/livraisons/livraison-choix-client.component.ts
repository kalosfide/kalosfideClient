import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { RouteurService } from 'src/app/services/routeur.service';
import { LivraisonService } from './livraison.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { Commande } from 'src/app/commandes/commande';
import { LivraisonPages } from './livraison-pages';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { LivraisonStock } from './livraison-stock';
import { Client } from 'src/app/modeles/client/client';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { LivraisonUtile } from './livraison-utile';
import { ILivraisonComponent } from './i-livraison-component';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonChoixClientComponent extends PageTableComponent<Commande> implements OnInit, OnDestroy, ILivraisonComponent {

    static _pageDef: PageDef = LivraisonPages.choixClient;
    pageDef: PageDef = LivraisonPages.choixClient;

    get titre(): string {
        return 'Commander pour un client' + ' - ' + this.pageDef.titre;
    }

    site: Site;
    identifiant: Identifiant;

    clients: Client[];

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
    ) {
        super(route, _service);
    }

    get service(): LivraisonService { return this._service; }
    get routeur(): RouteurService { return this._service.routeur; }
    get utile(): LivraisonUtile { return this.service.utile; }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            boutonsPourBtnGroup: [[], [Fabrique.lien.boutonAnnuler(this.utile.url.desClients())]]
        });
        return barre;
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    protected chargeData(data: Data) {
        const stock: LivraisonStock = data.stock;
        this.clients = stock.clients;
        const commandes = stock.apiCommandesATraiter;
        this.liste = this.clients
            .filter((cl: Client) =>
                // le fournisseur peut commander pour un client avec compte pendant la livraison
                (!cl.avecCompte)
                &&
                (commandes === undefined // il n'y a jamais eu de livraison
                // ou le client n'est pas déjà dans la livraison
                || commandes.find((co: ApiCommande) => KeyUidRno.compareKey(cl, co)) === undefined)
            )
            .map((client: Client) => {
                const apiCommande = new ApiCommande();
                apiCommande.uid = client.uid;
                apiCommande.rno = client.rno;
                apiCommande.no = 0;
                apiCommande.details = [];
                return new Commande(apiCommande, client);
            });
    }

    créeGroupeTableDef(): IGroupeTableDef<Commande> {
        const outils = Fabrique.vueTable.outils<Commande>(this.nom);
        outils.ajoute(this.utile.outils.clientDeCommandes());
        outils.texteRienPasseFiltres = `Il n\'a pas de client correspondant aux critères de recherche.`;
        const colonnesDefs: IKfVueTableColonneDef<Commande>[] = [
            this.utile.colonne.commande.client(),
            this.utile.colonne.commande.choisit(),
        ];
        const vueTableDef: IKfVueTableDef<Commande> = {
            colonnesDef: colonnesDefs,
            outils: outils,
            quandClic: (commande: Commande) => (() => this.routeur.navigueUrlDef(this.utile.url.dUnClient(commande))).bind(this)
        };
        return {
            vueTableDef: vueTableDef
        };
    }

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
    }

    protected chargeGroupe() {

        this._chargeVueTable(this.liste);
    }
}
