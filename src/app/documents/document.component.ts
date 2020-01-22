import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageTableComponent } from '../disposition/page-table/page-table.component';
import { DocumentDétail } from './document-detail';
import { PageDef } from '../commun/page-def';
import { DocumentPages } from './document-pages';
import { Site } from '../modeles/site/site';
import { Identifiant } from '../securite/identifiant';
import { BarreTitre } from '../disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { DocumentCommande } from './document-commande';
import { ActivatedRoute, Data } from '@angular/router';
import { SiteService } from '../modeles/site/site.service';
import { RouteurService } from '../services/routeur.service';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { IGroupeTableDef, GroupeTable } from '../disposition/page-table/groupe-table';
import { IKfVueTableDef } from '../commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { EtatTableType } from '../disposition/page-table/etat-table';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { DocumentService } from './document.service';
import { DocumentUtile } from './document-utile';
import { KfTexte } from '../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTable, IKfTableLigne, IKfTableCellule } from '../commun/kf-composants/kf-table/kf-table-composant';
import { KfGéreCss } from '../commun/kf-composants/kf-partages/kf-gere-css';
import { IDocument, IDocumentLigne } from './document';
import { IKfVueTableColonneDef } from '../commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';

export abstract class DocumentComponent extends PageTableComponent<IDocumentLigne> implements OnInit, OnDestroy {

    site: Site;
    identifiant: Identifiant;
    barre: BarreTitre;

    protected _document: IDocument;

    constructor(
        protected route: ActivatedRoute,
        protected _service: DocumentService,
        protected _siteService: SiteService,
    ) {
        super(route, _service);
    }

    get service(): DocumentService { return this._service; }
    get routeur(): RouteurService { return this._service.routeur; }
    get utile(): DocumentUtile { return this.service.utile; }

    get titre(): string {
        return this._document.titre;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            boutonsPourBtnGroup: [[this.utile.lien.retourDeDocument(this._document)]]
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

    private ajouteGroupeEnTête() {
        const groupe = new KfGroupe('entete');
        let etiquette = new KfEtiquette('', this.site.titre);
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        etiquette.ajouteClasseDef('doc-titre-site');
        groupe.ajoute(etiquette);
        etiquette = new KfEtiquette('');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        let kftexte = new KfTexte('', this._document.titre);
        kftexte.ajouteClasseDef('doc-titre-doc');
        etiquette.contenuPhrase.ajoute(kftexte);
        kftexte = new KfTexte('', Fabrique.texte.date(this._document.date));
        kftexte.ajouteClasseDef('doc-titre-date');
        etiquette.contenuPhrase.ajoute(kftexte);
        groupe.ajoute(etiquette);

        const ligne: IKfTableLigne = {
            cellules: [],
            géreCss: new KfGéreCss()
        };
        ligne.géreCss.ajouteClasseDef('doc-titre-client');
        let cellule: IKfTableCellule = { texte: this._document.àOuDe, géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasseDef('doc-titre-texte');
        ligne.cellules.push(cellule);
        etiquette = new KfEtiquette('');
        kftexte = new KfTexte('', this._document.client.nom);
        kftexte.suiviDeSaut = true;
        etiquette.contenuPhrase.ajoute(kftexte);
        kftexte = new KfTexte('', this._document.client.adresse);
        etiquette.contenuPhrase.ajoute(kftexte);
        cellule = { composant: etiquette, géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasseDef('doc-titre-texte');
        ligne.cellules.push(cellule);

        const table = new KfTable('');
        table.corps = [ligne];
        groupe.ajoute(table);
        this.superGroupe.ajoute(groupe);
    }

    protected abstract colonneDefs(): IKfVueTableColonneDef<IDocumentLigne>[];

    créeGroupeTableDef(): IGroupeTableDef<IDocumentLigne> {

        const vueTableDef: IKfVueTableDef<IDocumentLigne> = {
            colonnesDef: this.colonneDefs(),
        };
        return {
            vueTableDef: vueTableDef,
            typeEtat: EtatTableType.remplaceTableSiVide
        };
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('details');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<IDocumentLigne>(groupeTableDef);
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
        this._document = data.document;
    }

    initialiseUtile() {
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);

        this.ajouteGroupeEnTête();
        this.ajouteGroupeDétails();

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        this._chargeVueTable(this._document.lignes);
        this.groupeTable.etat.initialise(this._document.texteVide, null, 'info');
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

