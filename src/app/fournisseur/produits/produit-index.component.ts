import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { ProduitPages, ProduitRoutes } from './produit-pages';
import { ProduitIndexBaseComponent } from 'src/app/produits/produit-index-base.component';
import { PageDef } from 'src/app/commun/page-def';
import { Produit } from 'src/app/modeles/produit';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { ProduitService } from 'src/app/modeles/produit.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfVueCelluleDef } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styles: []
})
export class ProduitIndexComponent extends ProduitIndexBaseComponent implements OnInit {

    // static pour pouvoir le lire dans le prototype sans avoir l'instance
    static _pageDef: PageDef = ProduitPages.index;
    pageDef: PageDef = ProduitPages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = ProduitPages;
    dataRoutes = ProduitRoutes;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(router, route, service);
        this.vueTableDef.commandes = this._commandes;
    }

    protected get _avantTable(): () => KfComposant[] {
        return () => {
            const groupe = new KfGroupe('');
            groupe.ajouteClasseDef('nav');
            if (this.categories.length !== 0) {
                groupe.ajoute(this.créeLienAjoute());
            }
            const lien = Fabrique.lien(ProduitPages.categories, ProduitRoutes, this.site.nomSite);
            lien.ajouteClasseDef('nav-link');
            groupe.ajoute(lien);
            return [
                groupe,
            ];
        };
    }

    protected get _cellules(): (item: Produit) => KfVueCelluleDef[] {
        return (ligne) => [
            ligne.nomCategorie,
            ligne.nom,
            this.texteSeCommande(ligne),
            this.textePrix(ligne),
        ];
    }

    protected get _commandes(): (item: Produit) => KfComposant[] {
        return (ligne) => [
            this.créeLienEdite(ligne),
            this.créeLien(ProduitPages.prix, ligne)
        ];
    }

}
