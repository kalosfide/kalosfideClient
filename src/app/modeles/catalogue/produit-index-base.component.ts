import { OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { Site } from '../site';
import { KeyUidRnoNoIndexComponent } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no-index.component';
import { Categorie } from './categorie';
import { IdEtatProduit, EtatsProduits, EtatProduit } from './etat-produit';
import { IKfVueTableDef } from '../../commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { Catalogue } from './catalogue';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import {
    KfListeDeroulanteNombre, KfListeDeroulanteTexte
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { CategoriePages, CategorieRoutes } from 'src/app/fournisseur/produits/categories/categorie-pages';
import { ProduitPages, ProduitRoutes } from 'src/app/fournisseur/produits/produit-pages';
import { BootstrapType } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { EtatTableType } from 'src/app/disposition/page-table/etat-table';


export abstract class ProduitIndexBaseComponent extends KeyUidRnoNoIndexComponent<Produit> implements OnDestroy {

    site: Site;

    categories: Categorie[];

    protected _identifiantEstFournisseur: boolean;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(route, service);
    }

    protected _créeVueTableDef(): IKfVueTableDef<Produit> {
        let colonnesDef: IKfVueTableColonneDef<Produit>[];
        const outils = Fabrique.vueTable.outils<Produit>(this.nom);
        outils.ajoute(this.service.utile.outils.produit());
        outils.ajoute(this.service.utile.outils.catégorie());
        if (this._identifiantEstFournisseur) {
            colonnesDef = this.service.utile.colonne.colonnesFournisseur();
            outils.ajoute(this.service.utile.outils.état());
            const outilAjoute = this.service.utile.outils.ajoute();
            outilAjoute.bbtnGroup.nePasAfficherSi(this.service.utile.conditionSite.pas_catalogue);
            outils.ajoute(outilAjoute);
        } else {
            colonnesDef = this.service.utile.colonne.colonnes();
        }
        outils.texteRienPasseFiltres = `Il n\'a pas de produits correspondant aux critères de recherche.`;

        const vueTableDef: IKfVueTableDef<Produit> = {
            colonnesDef: colonnesDef,
            outils: outils,
            id: (produit: Produit) => '' + produit.no,
        };
        return vueTableDef;
    }

    créeGroupeTableDef(): IGroupeTableDef<Produit> {
        const vueTableDef = this._créeVueTableDef();
        return {
            vueTableDef: vueTableDef,
            typeEtat: EtatTableType.toujoursAffiché
        };
    }

    get produits(): Produit[] { return this.liste as Produit[]; }
    get nomsCategories(): string[] {
        return this.produits.map(p => p.nomCategorie);
    }

    /**
     * fixe la liste de la vueTable: surcharge du  cas par défaut où il y a un champ 'liste'
     * @param data Data résolu avec un champ 'catalogue'
     */
    protected chargeData(data: Data) {
        const catalogue: Catalogue = data.catalogue;
        this.liste = catalogue.produits;
        this.categories = catalogue.catégories;
        this.liste.forEach(p => p.nomCategorie = this.categories.find(c => c.no === p.categorieNo).nom);
    }

    protected chargeGroupe() {
        let filtre = this.vueTable.outils.outil(this.service.utile.outils.nomOutil.catégorie);
        const listeCatégories: KfListeDeroulanteNombre = filtre.composant as KfListeDeroulanteNombre;
        this.categories.forEach((c: Categorie) => listeCatégories.créeEtAjouteOption(c.nom, c.no));
        filtre = this.vueTable.outils.outil(this.service.utile.outils.nomOutil.état);
        if (filtre) {
            const listeEtats: KfListeDeroulanteTexte = filtre.composant as KfListeDeroulanteTexte;
            EtatsProduits.etats.forEach((e: EtatProduit) => listeEtats.créeEtAjouteOption(e.texte, e.valeur));
        }
        const nbProduits = this.liste.length;
        // si l'utilisateur n'est pas le fournisseur, les produits n'ont pas de champ etat mais sont disponibles
        const nbDisponibles = this.liste.filter(p => p.etat === undefined || p.etat === null || p.etat === IdEtatProduit.disponible).length;
        const nbCatégories = this.categories.length;
        let message: string;
        let urlDef: IUrlDef;
        let texte: string;
        let type: BootstrapType;
        if (nbProduits === 0) {
            if (nbCatégories === 0) {
                message = 'Le catalogue est vide. Vous devez créer au moins une catégorie et y ajouter des produits.';
                urlDef = {
                    pageDef: CategoriePages.ajoute,
                    routes: CategorieRoutes,
                    nomSite: () => this.site.nomSite
                };
                texte = 'Créer une catégorie';
                type = 'warning';
            } else {
                message = 'Il n\'y a pas de produits dans le catalogue.';
                urlDef = {
                    pageDef: ProduitPages.ajoute,
                    routes: ProduitRoutes,
                    nomSite: () => this.site.nomSite
                };
                texte = 'Créer un produit';
                type = 'warning';
            }
        } else {
            if (nbDisponibles === 0) {
                message = 'Il n\'y a pas de produits disponibles dans le catalogue.';
                type = 'warning';
            } else {
                message = `Le catalogue propose ${nbDisponibles === 1 ? 'un produit' : nbDisponibles + ' produits'}`
                    + ` dans ${nbCatégories === 1 ? 'une catégorie' : nbCatégories + ' catégories'}.`;
                type = 'success';
            }
        }
        let lienDef: ILienDef;
        if (urlDef || texte) {
            lienDef = {
                url: urlDef,
                contenu: { texte: texte }
            };
        }
        this.groupeTable.etat.initialise(message, lienDef, type);
        this._chargeVueTable(this.liste);
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
    }

}
