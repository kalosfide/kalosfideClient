import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { ActivatedRoute, Data } from '@angular/router';
import { FacturePages } from './facture-pages';
import { FactureService } from './facture.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { FactureUtile } from './facture-utile';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RouteurService } from 'src/app/services/routeur.service';
import { SiteService } from 'src/app/modeles/site.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { EtatTableType } from 'src/app/disposition/page-table/etat-table';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { FactureDétail } from './facture-detail';
import { FactureCommande } from './facture-commande';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { FactureStock } from './facture-stock';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class FactureCommandeComponent extends PageTableComponent<FactureDétail> implements OnInit, OnDestroy {

    static _pageDef: PageDef = FacturePages.commande;
    pageDef: PageDef = FacturePages.commande;

    site: Site;
    identifiant: Identifiant;
    barre: BarreTitre;

    date: Date;

    stock: FactureStock;
    factureCommande: FactureCommande;

    constructor(
        protected route: ActivatedRoute,
        protected _service: FactureService,
        protected _siteService: SiteService,
    ) {
        super(route, _service);
    }

    get service(): FactureService { return this._service; }
    get routeur(): RouteurService { return this._service.routeur; }
    get utile(): FactureUtile { return this.service.utile; }

    get titre(): string {
        return `Facturer ${this.factureCommande.client.nom} - ${this.factureCommande.texteBonDeLivraison}`;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            boutonsPourBtnGroup: [[this.utile.lien.retourDeFactureCommande(this.factureCommande)]]
        });

        this.barre = barre;

        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { t: 'à faire', b: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    créeGroupeTableDef(): IGroupeTableDef<FactureDétail> {
        const outils = Fabrique.vueTable.outils<FactureDétail>(this.nom);
        outils.ajoute(this.utile.outils.catégorie());
        outils.ajoute(this.utile.outils.produit());

        const vueTableDef: IKfVueTableDef<FactureDétail> = {
            colonnesDef: this.utile.colonne.détailFacture(this.factureCommande),
            outils: outils,
            superGroupe: (ligne: FactureDétail) => {
                if (!ligne.superGroupe) {
                    ligne.créeSuperGroupe();
                    const apiAction: ApiRequêteAction = {
                        demandeApi: () => this.service.factureDétail(ligne),
                        actionSiOk: () => this.service.factureDétailOk(ligne),
                        formulaire: ligne.superGroupe
                    };
                    Fabrique.input.prépareSuitValeurEtFocus(ligne.aFacturerNombre, apiAction, this.service);
                }
                return ligne.superGroupe;
            },
            id: (t: FactureDétail) => {
                return this.utile.url.id('' + t.produit.no);
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
        this.groupeTable = new GroupeTable<FactureDétail>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    rafraichit() {
        this.barre.rafraichit();
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        this.stock = data.stock;
        this.factureCommande = data.commande;
        this.date = new Date(Date.now());
    }

    initialiseUtile() {
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;

        this.ajouteGroupeDétails();

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        this.utile.outils.chargeCatégories(this.vueTable, this.stock.catalogue.catégories);
        this._chargeVueTable(this.factureCommande.détails);
        this.groupeTable.etat.initialise('Il n\'a pas de commandes à facturer.', null, 'info');
        this.rafraichit();
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.initialiseUtile(),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
