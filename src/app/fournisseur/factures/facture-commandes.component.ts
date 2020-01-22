import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { ActivatedRoute, Data } from '@angular/router';
import { FacturePages } from './facture-pages';
import { FactureService } from './facture.service';
import { Client } from 'src/app/modeles/client/client';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { FactureUtile } from './facture-utile';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RouteurService } from 'src/app/services/routeur.service';
import { SiteService } from 'src/app/modeles/site/site.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { EtatTableType } from 'src/app/disposition/page-table/etat-table';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Facture } from './facture';
import { FactureCommande } from './facture-commande';
import { FactureStock } from './facture-stock';
import { ModeAction } from 'src/app/commandes/condition-action';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class FactureCommandesComponent extends PageTableComponent<FactureCommande> implements OnInit, OnDestroy {

    static _pageDef: PageDef = FacturePages.client;
    pageDef: PageDef = FacturePages.client;

    site: Site;
    identifiant: Identifiant;

    client: Client;

    barre: BarreTitre;

    date: Date;

    facture: Facture;

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
        return this.pageDef.titre;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            boutonsPourBtnGroup: [[this.utile.lien.retourDUneFacture(this.facture)]]
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
            { t: 'à faire', b: KfTypeDeBaliseHTML.b},
            '.'
        );

        return infos;
    }

    créeGroupeTableDef(): IGroupeTableDef<FactureCommande> {

        const vueTableDef: IKfVueTableDef<FactureCommande> = {
            colonnesDef: this.utile.colonne.factureCommande(this.facture),
            id: (t: FactureCommande) => {
                return this.utile.url.id(KeyUidRno.texteDeKey(t));
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
        this.groupeTable = new GroupeTable<FactureCommande>(groupeTableDef);
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
        const stock: FactureStock = data.stock;
        this.client = data.client;
        const apiFacture = stock.factures.find(f => f.uid === this.client.uid && f.rno === this.client.rno);
        this.facture = new Facture(apiFacture, this.client, stock.catalogue);
        this.date = new Date(Date.now());
    }

    initialiseUtile() {
        this.service.changeMode(ModeAction.edite);
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;

        this.ajouteGroupeDétails();

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        this._chargeVueTable(this.facture.commandes);
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
