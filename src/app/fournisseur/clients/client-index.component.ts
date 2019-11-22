import { Component, OnInit } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { ClientPages, ClientRoutes } from './client-pages';
import { Site } from 'src/app/modeles/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { ActivatedRoute } from '@angular/router';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Client } from 'src/app/modeles/clientele/client';
import { KeyUidRnoIndexComponent } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-index.component';
import { ClientService } from 'src/app/modeles/clientele/client.service';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { EtatTableType } from 'src/app/disposition/page-table/etat-table';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { texteKeyUidRno } from 'src/app/commun/data-par-key/data-key';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class ClientIndexComponent extends KeyUidRnoIndexComponent<Client> implements OnInit {

    static _pageDef: PageDef = ClientPages.index;
    pageDef: PageDef = ClientPages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = ClientPages;
    dataRoutes = ClientRoutes;

    site: Site;
    identifiant: Identifiant;
    clients: Client[];

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super(route, service);
    }

    créeGroupeTableDef(): IGroupeTableDef<Client> {
        const outils = Fabrique.vueTable.outils<Client>(this.nom);
        outils.ajoute(this.service.utile.outils.client());
        outils.texteRienPasseFiltres = `Il n\'a pas de client correspondant aux critères de recherche.`;

        let colonnes: IKfVueTableColonneDef<Client>[];
        if (this.site.etat === IdEtatSite.livraison) {
            colonnes = this.service.utile.colonne.colonnesLivraison();
        } else {
            colonnes = this.service.utile.colonne.colonnes();
            outils.ajoute(this.service.utile.outils.ajoute());
        }

        return {
            vueTableDef: {
                colonnesDef: colonnes,
                outils: outils,
                id: (t: Client) => {
                    return this.service.utile.url.id(texteKeyUidRno(t));
                },
            },
            typeEtat: EtatTableType.remplaceTableSiVide
        };
    }

    protected chargeGroupe() {
        this.groupeTable.etat.initialise('Il n\'a pas de clients.', this.lienDefAjoute(), 'warning');
        this._chargeVueTable(this.liste);
    }

    calculeModeTable(): ModeTable {
        return this.site.etat === IdEtatSite.livraison ? ModeTable.aperçu : ModeTable.edite;
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
        this.pageTableDef.chargeGroupe = () => this.chargeGroupe();
        this.pageTableDef.initialiseUtile = () => this.service.initialiseModeTable(this.calculeModeTable());
    }

}
