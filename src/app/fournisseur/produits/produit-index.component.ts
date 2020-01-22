import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ProduitPages, ProduitRoutes } from './produit-pages';
import { ProduitIndexBaseComponent } from 'src/app/modeles/catalogue/produit-index-base.component';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { SiteService } from 'src/app/modeles/site/site.service';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IBarreDef } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { EtatTableType } from 'src/app/disposition/page-table/etat-table';
import { ProduitEditeur } from '../../modeles/catalogue/produit-editeur';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class ProduitIndexComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    // static pour pouvoir le lire dans le prototype sans avoir l'instance
    static _pageDef: PageDef = ProduitPages.index;
    pageDef: PageDef = ProduitPages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = ProduitPages;
    dataRoutes = ProduitRoutes;

    constructor(
        protected route: ActivatedRoute,
        protected _service: ProduitService,
        protected siteService: SiteService,
    ) {
        super(route, _service);
        this._identifiantEstFournisseur = true;
    }

    protected get barreTitreDef(): IBarreDef {
        const urlDef: IUrlDef = {
            pageDef: ProduitPages.categories,
            routes: ProduitRoutes,
            nomSite: this.site.nomSite
        };
        const lien = Fabrique.lien.retour(urlDef);
        lien.afficherSi(this._service.utile.conditionSite.catalogue);
        const def = this._barreTitreDef;
        def.boutonsPourBtnGroup = [[lien]];
        return def;
    }

    protected contenuAidePage = (): KfComposant[] => {
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

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
    }

    créeGroupeTableDef(): IGroupeTableDef<Produit> {
        const vueTableDef = this._créeVueTableDef();
        vueTableDef.superGroupe = (produit: Produit) => {
            const editeur = new ProduitEditeur(this);
            const superGroupe = editeur.créeSuperGroupe();
            editeur.fixeValeur(produit);
            produit.editeur = editeur;
            let apiAction: ApiRequêteAction = {
                demandeApi: (() => {
                    return this.service.edite(produit.apiProduitPrix);
                }).bind(this),
                actionSiOk: () => this.service.quandEdite(produit),
                formulaire: superGroupe
            };
            Fabrique.input.prépareSuitValeurEtFocus(editeur.kfPrix, apiAction, this.service);
            apiAction = {
                demandeApi: (() => {
                    return this.service.edite(produit.apiProduitEtat);
                }).bind(this),
                actionSiOk: () => this.service.quandEdite(produit),
                formulaire: superGroupe
            };
            Fabrique.listeDéroulante.prépareSuitValeurEtFocus(editeur.kfEtat, apiAction, this.service);
            return superGroupe;
        };
        return {
            vueTableDef: vueTableDef,
            typeEtat: EtatTableType.toujoursAffiché
        };
    }

    calculeModeTable(): ModeTable {
        return this.site.etat === IdEtatSite.catalogue ? ModeTable.edite : ModeTable.aperçu;
    }

    rafraichit() {
        this._service.changeModeTable(this.calculeModeTable());
    }

    aprèsChargeData() {
        this.subscriptions.push(
            this._service.navigation.siteObs().subscribe(() => this.rafraichit())
        );
    }

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
        this.pageTableDef.initialiseUtile = () => this._service.initialiseModeTable(this.calculeModeTable());
        this.pageTableDef.aprèsChargeData = () => this.aprèsChargeData();
    }

}
