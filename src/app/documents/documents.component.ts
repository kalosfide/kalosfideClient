import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageTableComponent } from '../disposition/page-table/page-table.component';
import { IDocument } from './document';
import { PageDef } from '../commun/page-def';
import { DocumentPages } from './document-pages';
import { Site } from '../modeles/site/site';
import { Identifiant } from '../securite/identifiant';
import { BarreTitre } from '../disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { DocumentCommande, DocumentLivraison } from './document-commande';
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
import { ApiDocuments } from './document-api';
import { Client } from '../modeles/client/client';
import { DocumentFacture } from './document-facture';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
    styleUrls: ['../commun/commun.scss']
})
export class DocumentsComponent extends PageTableComponent<IDocument> implements OnInit, OnDestroy {

    static _pageDef: PageDef = DocumentPages.liste;
    pageDef: PageDef = DocumentPages.liste;

    site: Site;
    identifiant: Identifiant;
    barre: BarreTitre;

    documents: IDocument[];

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
        return `Documents`;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
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

    créeGroupeTableDef(): IGroupeTableDef<IDocument> {

        const vueTableDef: IKfVueTableDef<IDocument> = {
            colonnesDef: this.utile.colonne.documents(this.identifiant.estClient(this.site)),
        };
        return {
            vueTableDef: vueTableDef,
            typeEtat: EtatTableType.remplaceTableSiVide
        };
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('lignes');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<IDocument>(groupeTableDef);
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
        const apiDocuments: ApiDocuments = data.apiDocuments;
        const clients: Client[] = data.clients;
        this.documents = [];
        apiDocuments.commandes.forEach(apiCommande => {
            const client = clients.find(c => c.uid === apiCommande.uid && c.rno === apiCommande.rno);
            if (apiCommande.lignesC) {
                this.documents.push(new DocumentCommande(apiCommande, client));
            }
            if (apiCommande.lignesL) {
                this.documents.push(new DocumentLivraison(apiCommande, client));
            }
        });
        apiDocuments.factures.forEach(apiFacture => {
            const client = clients.find(c => c.uid === apiFacture.uid && c.rno === apiFacture.rno);
            this.documents.push(new DocumentFacture(apiFacture, client));
        });
    }

    initialiseUtile() {
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);

        this.ajouteGroupeDétails();

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        this._chargeVueTable(this.documents);
        this.groupeTable.etat.initialise('Il n\'a pas de documents.', null, 'info');
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

