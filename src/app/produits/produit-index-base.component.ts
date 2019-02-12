import { OnInit, OnDestroy } from '@angular/core';

import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { ProduitService } from '../modeles/produit.service';
import { Produit, CompareProduits } from '../modeles/produit';
import { Site } from '../modeles/site';
import { KfAfficheResultat } from '../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfResultatAffichable } from '../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfTypeResultatAffichable } from '../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { KeyUidRnoNoIndexComponent } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no-index.component';
import { TypesMesures } from '../modeles/type-mesure';
import { Tri } from '../commun/outils/trieur';
import { Categorie } from '../modeles/categorie';
import { TypesCommandes } from '../modeles/type-commande';
import { IdEtatProduit, EtatsProduits } from '../modeles/etat-produit';
import { KfVueCelluleDef, KfVueTableDef } from '../commun/kf-composants/kf-vue-table/kf-vue-table';
import { KfVueTableFiltre } from '../commun/kf-composants/kf-vue-table/kf-vue-table-filtre';

const NOM_TRI_CATEGORIE = 'categorie';
const NOM_TRI_PRODUIT = 'produit';
const NOM_FILTRE_CATEGORIE = 'categorie';
const NOM_FILTRE_ETAT = 'etat';

export abstract class ProduitIndexBaseComponent extends KeyUidRnoNoIndexComponent<Produit> implements OnInit, OnDestroy {

    site: Site;

    categories: Categorie[];

    vueTableDef: KfVueTableDef<Produit>;
    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(router, route, service);
        this.vueTableDef = {
            enTetesDef: [
                {
                    texte: 'Catégorie',
                    tri: new Tri(NOM_TRI_CATEGORIE, CompareProduits.nomCategorie)
                },
                {
                    texte: 'Nom',
                    tri: new Tri(NOM_TRI_PRODUIT, CompareProduits.nom)
                },
                {
                    texte: 'Se commande',
                },
                {
                    texte: 'Prix'
                }
            ],
            cellules: this._cellules,
            filtres: [
                new KfVueTableFiltre(NOM_FILTRE_CATEGORIE, 'Filtrer par catégorie',
                    (p: Produit, noCategorie: string) => p.categorieNo.toString() === noCategorie),
                new KfVueTableFiltre(NOM_FILTRE_ETAT, 'Filtrer par état',
                    (p: Produit, idEtat: IdEtatProduit) => EtatsProduits.etat(idEtat).vérifie(p), true)
            ]
        };

    }

    get produits(): Produit[] { return this.liste as Produit[]; }
    get nomsCategories(): string[] {
        return this.produits.map(p => p.nomCategorie);
    }

    appRouteDeKey = (produit: Produit): string => {
        return '' + produit.no;
    }

    indisponible(ligne: Produit): boolean {
        return ligne.prix <= 0;
    }

    textePrix(ligne: Produit): string {
        return this.indisponible(ligne)
            ? 'indisponible'
            : TypesMesures.ParId(ligne.typeMesure).textePrix(ligne.prix);
    }

    texteSeCommande(ligne: Produit): string {
        return TypesMesures.texteSeCommande(TypesMesures.ParId(ligne.typeMesure), TypesCommandes.ParId(ligne.typeCommande));
    }

    protected get _avantTable(): () => KfComposant[] {
        return () => [];
    }

    protected get _cellules(): (ligne: Produit) => KfVueCelluleDef[] {
        return (ligne) => [ligne.nomCategorie, ligne.nom, this.texteSeCommande(ligne), this.textePrix(ligne)];
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        const resultatListeVide = new KfAfficheResultat('listevide');
        resultatListeVide.finit(new KfResultatAffichable(KfTypeResultatAffichable.Avertissement, 'Il n\'a pas de produits proposés.'));
        this.remplaceListeVide = resultatListeVide;
        this.avantTable = this._avantTable;
        this.chargeData = (data: Data) => {
            this.categories = data.categories;
            this.vueTable.chargeFiltre(NOM_FILTRE_CATEGORIE, this.categories.map(c => ({ texte: c.nom, valeur: c.no })), -1);
            this.vueTable.chargeFiltre(NOM_FILTRE_ETAT, EtatsProduits.etats, EtatsProduits.tous.valeur);
        };

        this.ngOnInit_Charge();
    }

}
