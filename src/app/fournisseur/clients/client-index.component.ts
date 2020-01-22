import { Component, OnInit } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { ClientPages, ClientRoutes } from './client-pages';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { ActivatedRoute } from '@angular/router';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Client } from 'src/app/modeles/client/client';
import { KeyUidRnoIndexComponent } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-index.component';
import { ClientService } from 'src/app/modeles/client/client.service';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { EtatTableType } from 'src/app/disposition/page-table/etat-table';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

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
        protected _service: ClientService,
    ) {
        super(route, _service);
    }

    créeGroupeTableDef(): IGroupeTableDef<Client> {
        const outils = Fabrique.vueTable.outils<Client>(this.nom);
        outils.ajoute(this._service.utile.outils.client());
        outils.texteRienPasseFiltres = `Il n\'a pas de client correspondant aux critères de recherche.`;
            outils.ajoute(this._service.utile.outils.ajoute());

        return {
            vueTableDef: {
                colonnesDef: this._service.utile.colonne.colonnes(),
                outils: outils,
                id: (t: Client) => {
                    return this._service.utile.url.id(KeyUidRno.texteDeKey(t));
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
        return ModeTable.edite;
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
        this.pageTableDef.chargeGroupe = () => this.chargeGroupe();
        this.pageTableDef.initialiseUtile = () => this._service.initialiseModeTable(this.calculeModeTable());
    }

}
