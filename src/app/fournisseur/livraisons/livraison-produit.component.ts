import { Component, OnInit, OnDestroy } from '@angular/core';

import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ValeurTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { PageDef } from 'src/app/commun/page-def';
import { LivraisonPages, LivraisonRoutes } from './livraison-pages';
import { Site } from 'src/app/modeles/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { LivraisonProduit } from './livraison-produit';
import { ActivatedRoute, RouterStateSnapshot, Data } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { Observable } from 'rxjs';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { Client } from 'src/app/modeles/clientele/client';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { LivraisonStock } from './livraison-stock';
import { LivraisonUtile } from './livraison-utile';
import { RouteurService } from 'src/app/services/routeur.service';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { ILivraisonComponent } from './i-livraison-component';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { EtatTableType } from 'src/app/disposition/page-table/etat-table';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { texteKeyUidRno } from 'src/app/commun/data-par-key/data-key';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonProduitComponent extends PageTableComponent<DetailCommande>
    implements OnInit, OnDestroy, ILivraisonComponent, ComponentAAutoriserAQuitter {

    static _pageDef: PageDef = LivraisonPages.produit;
    pageDef: PageDef = LivraisonPages.produit;

    get titre(): string {
        return `Commandes de ${this.livraisonProduit.produit.nom}`;
    }

    private _lienRetour: KfLien;

    get lienRetour(): KfLien {
        if (!this._lienRetour) {
            this._lienRetour = this.utile.lien.retourDUnProduit(this.livraisonProduit);
        }
        return this._lienRetour;
    }

    site: Site;
    identifiant: Identifiant;

    livraisonProduit: LivraisonProduit;

    constructor(
        protected route: ActivatedRoute,
        private peutQuitterService: PeutQuitterService,
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
            contenuAidePage: this.contenuAidePage(),
            boutonsPourBtnGroup: [[this.utile.lien.retourDUnProduit(this.livraisonProduit)]]
        });

        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { t: 'à faire', b: KfTypeDeBaliseHTML.b},
            '.'
        );

        return infos;
    }

    peutQuitter = (nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> => {
        if (nextState) {
            const urlDef: IUrlDef = {
                pageDef: LivraisonPages.produit,
                routes: LivraisonRoutes,
                nomSite: this.site.nomSite
            };
            let permise = ValeurTexteDef(Fabrique.url.url(urlDef));
            if (nextState.url === permise) {
                return true;
            }
            urlDef.pageDef = LivraisonPages.produit;
            permise = ValeurTexteDef(Fabrique.url.url(urlDef));
            if (nextState.url.substr(0, permise.length) === permise) {
                return true;
            }
        }
        return this.peutQuitterService.confirme(this.pageDef.titre);
    }

    créeGroupeTableDef(): IGroupeTableDef<DetailCommande> {
        const outils = Fabrique.vueTable.outils<DetailCommande>(this.nom);
        outils.ajoute(this.utile.outils.client());
        outils.nePasAfficherSi(this.utile.conditionTable.bilan);

        const vueTableDef: IKfVueTableDef<DetailCommande> = {
            colonnesDef: this.utile.colonne.détail.defsDUnProduit(this.livraisonProduit),
            outils: outils,
            superGroupe: (ligne: DetailCommande) => {
                if (!ligne.superGroupe) {
                    ligne.créeSuperGroupe();
                }
                return ligne.superGroupe;
            },
            id: (t: DetailCommande) => {
                return this.utile.url.id(texteKeyUidRno(t.client));
            },
        };

        return {
            vueTableDef: vueTableDef,
            typeEtat: EtatTableType.remplaceTableSiVide
        };
    }

    rafraichit() {
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        const stock: LivraisonStock = data.stock;
        const clients: Client[] = data.clients;
        const produit: Produit = data.produit;
        this.livraisonProduit = new LivraisonProduit(stock, clients, produit);
    }

    protected chargeGroupe() {
        this._chargeVueTable(this.livraisonProduit.détails);
        this.rafraichit();
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeGroupe('super'),
            initialiseUtile: () => this.service.utile.url.initialiseRouteDétail({ produit: this.livraisonProduit }),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
