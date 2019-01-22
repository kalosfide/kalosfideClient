import { Component, OnInit } from '@angular/core';
import { KeyUidRnoNoIndexComponent } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-index.component';
import { Categorie } from 'src/app/modeles/categorie';
import { PageDef } from 'src/app/commun/page-def';
import { CategoriePages } from './categorie-pages';
import { Site } from 'src/app/modeles/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Router, ActivatedRoute } from '@angular/router';
import { CategorieService } from 'src/app/modeles/categorie.service';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfAfficheResultat } from 'src/app/commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfResultatAffichable } from 'src/app/commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfTypeResultatAffichable } from 'src/app/commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { FournisseurRoutes, FournisseurPages } from '../../fournisseur-pages';
import { ProduitModifRoutes } from '../produit-pages';
import { KfVueCelluleDef, KfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';

@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
    styles: []
})
export class CategorieIndexComponent extends KeyUidRnoNoIndexComponent<Categorie> implements OnInit {

    static _pageDef: PageDef = CategoriePages.index;
    pageDef: PageDef = CategoriePages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = CategoriePages;

    site: Site;
    identifiant: Identifiant;
    vueTableDef: KfVueTableDef<Categorie> = {
        enTetes: [{ texte: 'Nom' }, { texte: 'Produits' }],
        cellules: (item: Categorie) => [item.nom, item.nbProduits.toString()],
        commandes: (item: Categorie) => [this.créeLienEdite(item)]
    };

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: CategorieService,
    ) {
        super(router, route, service);
    }

    appRouteDeKey = (categorie: Categorie): string => {
        return '' + categorie.no;
    }

    private get lienRetourAuxProduits(): KfLien {
        const lien = new KfLien('produits',
            ProduitModifRoutes.url(this.site.nomSite, [FournisseurPages.produits.urlSegment]), 'Retour aux produits');
        return lien;
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        this.avantTable = () => [this.créeLienAjoute()];
        this.apresTable = [this.lienRetourAuxProduits];
        const resultatListeVide = new KfAfficheResultat('listevide');
        resultatListeVide.finit(new KfResultatAffichable(KfTypeResultatAffichable.Avertissement, 'Il n\'a pas de categories de produits.'));
        this.remplaceListeVide = resultatListeVide;
        this.ngOnInit_Charge();
    }

}
