import { Categorie, CategorieData } from './categorie';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { Produit, ProduitData } from './produit';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { ApiCommande } from 'src/app/commandes/api-commande';

export class CatalogueApi {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    /** date du catalogue, absente si la modification est en cours */
    date?: Date;

    catégories: CategorieData[];
    produits: ProduitData[];
}

export interface CatalogueStock {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    /** date du catalogue, absente si la modification est en cours */
    date?: Date;


    catégories: Categorie[];
    produits: Produit[];
}

export class Catalogue {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    /** date du catalogue, absente si la modification est en cours */
    date?: Date;


    catégories: Categorie[];
    produits: Produit[];

    /**
     * si présent, le catalogue contient les produits dans leur état actuel et le site doit être dans l'état Catalogue
     * si vrai, le catalogue contient tous les produits et le site doit être dans l'état Catalogue
     * si faux, le catalogue contient tous les produits disponibles et le site ne doit pas être dans l'état Catalogue
    */
    private _complet?: boolean;

    /**
     * si présent, le catalogue contient les produits commandés dans leur état à la date de la commande
    */
    private _apiCommande?: ApiCommande;

    /**
     * si présent, le catalogue contient les produits commandés dans leur état à la date de la livraison
    */
    private _livraisonNo?: number;

    private constructor() {}

    /**
     * crée un catalogue à partir d'une lecture de l'Api
     * @param catalogueApi
     */
    static nouveau(catalogueApi: CatalogueApi): Catalogue {
        const catalogue = new Catalogue();
        catalogue.uid = catalogueApi.uid;
        catalogue.rno = catalogueApi.rno;
        catalogue.date = catalogueApi.date;
        catalogue.catégories = catalogueApi.catégories.map(
            (data: CategorieData) => {
                const categorie = new Categorie();
                categorie.uid = catalogueApi.uid;
                categorie.rno = catalogueApi.rno;
                categorie.no = data.no;
                categorie.copieData(data);
                return categorie;
            }
        );
        catalogue.produits = catalogueApi.produits.map(
            (data: ProduitData) => {
                const produit = new Produit();
                produit.uid = catalogueApi.uid;
                produit.rno = catalogueApi.rno;
                produit.no = data.no;
                produit.copieData(data);
                const categorie = catalogueApi.catégories.find(c => c.no === produit.categorieNo);
                produit.nomCategorie = categorie.nom;
                return produit;
            }
        );
        return catalogue;
    }

    /**
     * crée un catalogue ne contenant que les produits du catalogue initial passant le filtre et leurs catégories
     * @param catalogue
     * @param filtreProduit
     */
    static filtre(catalogue: Catalogue, filtreProduit: (p: Produit) => boolean): Catalogue {
        const filtré = new Catalogue();
        filtré.uid = catalogue.uid;
        filtré.rno = catalogue.rno;
        filtré.produits = catalogue.produits.filter(p => filtreProduit(p));
        filtré.catégories = catalogue.catégories.filter(c => filtré.produits.find(p => p.categorieNo === c.no));
        return filtré;
    }

    static estComplet(catalogue: Catalogue): boolean {
        return catalogue._complet === true;
    }
    static estDesDisponibles(catalogue: Catalogue): boolean {
        return catalogue._complet === false;
    }
    static fixeComplet(catalogue: Catalogue, complet: boolean) {
        catalogue._complet = complet;
        catalogue._apiCommande = undefined;
        catalogue._livraisonNo = undefined;
    }
    static apiCommande(catalogue: Catalogue): ApiCommande {
        return catalogue._apiCommande;
    }
    static fixeApiCommande(catalogue: Catalogue, apiCommande: ApiCommande) {
        catalogue._apiCommande = apiCommande;
        catalogue._complet = undefined;
        catalogue._livraisonNo = undefined;
    }
}
