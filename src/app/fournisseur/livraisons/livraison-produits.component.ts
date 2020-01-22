import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { ActivatedRoute, Data } from '@angular/router';
import { LivraisonProduits } from './livraison-produits';
import { LivraisonProduit } from './livraison-produit';
import { LivraisonService } from './livraison.service';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { LivraisonPages } from './livraison-pages';
import { Client } from 'src/app/modeles/client/client';
import { LivraisonStock } from './livraison-stock';
import { LivraisonUtile } from './livraison-utile';
import { RouteurService } from 'src/app/services/routeur.service';
import { ILivraisonComponent } from './i-livraison-component';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { EtatTableType } from 'src/app/disposition/page-table/etat-table';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KfListeDeroulanteNombre } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonProduitsComponent extends PageTableComponent<LivraisonProduit> implements OnInit, OnDestroy, ILivraisonComponent {

    static _pageDef: PageDef = LivraisonPages.produits;
    pageDef: PageDef = LivraisonPages.produits;

    private _lienCommandes: KfLien;
    get lienCommandes(): KfLien {
        if (!this._lienCommandes) {
            this._lienCommandes = this.utile.lien.desClients();
        }
        return this._lienCommandes;
    }

    get livraisonNo(): number { return this.livraisonProduits.stock.apiLivraison.no; }

    site: Site;
    identifiant: Identifiant;
    get utile(): LivraisonUtile {
        return this.service.utile;
    }

    livraisonProduits: LivraisonProduits;
    termine: boolean;

    constructor(
        protected route: ActivatedRoute,
        protected _livraisonService: LivraisonService,
    ) {
        super(route, _livraisonService);
    }

    get service(): LivraisonService { return this._livraisonService; }
    get routeur(): RouteurService { return this._livraisonService.routeur; }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            boutonsPourBtnGroup: [[this.utile.lien.desClients()]]
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

    créeGroupeTableDef(): IGroupeTableDef<LivraisonProduit> {
        const outils = Fabrique.vueTable.outils<LivraisonProduit>(this.nom);
        outils.ajoute(this.utile.outils.catégorieDeProduits());
        outils.ajoute(this.utile.outils.produitDeProduits());
        outils.nePasAfficherSi(this.utile.conditionTable.bilan);

        const vueTableDef: IKfVueTableDef<LivraisonProduit> = {
            colonnesDef: this.utile.colonne.produit.defsProduits(this.livraisonProduits),
            outils: outils,
            id: (t: LivraisonProduit) => {
                return this.utile.url.id('' + t.no);
            },
        };

        return {
            vueTableDef: vueTableDef,
            typeEtat: EtatTableType.remplaceTableSiVide
        };
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('commandes');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<LivraisonProduit>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    protected calculeModeTable(): ModeTable {
        return this.termine
            ? ModeTable.bilan
            : this.site.etat === IdEtatSite.catalogue
                ? ModeTable.aperçu
                : ModeTable.edite;
    }

    rafraichit() {
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        const stock: LivraisonStock = data.stock;
        this.livraisonProduits = new LivraisonProduits(stock);
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;

        this.superGroupe.ajoute(this.utile.groupeCatalogue());
        this.ajouteGroupeDétails();
//        this.ajouteGroupesEnvoi();

        this.superGroupe.quandTousAjoutés();
    }

    protected chargeGroupe() {
        const filtre = this.vueTable.outils.outil(this.utile.outils.nomOutil.catégorie);
        const liste: KfListeDeroulanteNombre = filtre.composant as KfListeDeroulanteNombre;
        this.livraisonProduits.stock.catalogue.catégories.forEach((c: Categorie) => liste.créeEtAjouteOption(c.nom, c.no));
        this._chargeVueTable(this.livraisonProduits.produits);
        this.rafraichit();
    }

    aprèsChargeData() {
        this.subscriptions.push(
            this.service.modeActionIO.observable.subscribe(() => this.rafraichit())
        );
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => this.aprèsChargeData()
        };
    }
}
