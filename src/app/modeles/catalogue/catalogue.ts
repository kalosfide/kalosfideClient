import { Categorie, CategorieData, ICategorieData } from './categorie';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { Produit, ProduitData, IProduitData } from './produit';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { PrixDaté } from './prix-date';

export interface ICatalogueApi {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    /** date du catalogue, absente si la modification est en cours */
    date?: Date;

    catégories: ICategorieData[];
    produits: IProduitData[];
}

export class CatalogueApi implements ICatalogueApi {
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
     * si présent, le catalogue contient les produits dans leur état actuel
     * si vrai, le catalogue contient tous les produits et le site doit être dans l'état Catalogue
     * si faux, le catalogue contient tous les produits disponibles et le site ne doit pas être dans l'état Catalogue
    */
    private _avecIndisponibles?: boolean;

    /**
     * si présent, le catalogue contient les produits commandés dans leur état à la date de la commande
    */
    private _apiCommande?: ApiCommande;

    private constructor() { }

    /**
     * Fixé quand des tarifs sont ajoutés au catalogue
    */
    prixDatés?: PrixDaté[];

    /**
     * crée un catalogue à partir d'une lecture de l'Api
     * @param catalogueApi
     */
    static nouveau(catalogueApi: ICatalogueApi): Catalogue {
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
                Produit.copieData(data, produit);
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

    static estAvecIndisponibles(catalogue: Catalogue): boolean {
        return catalogue._avecIndisponibles === true;
    }
    static estDesDisponibles(catalogue: Catalogue): boolean {
        return catalogue._avecIndisponibles === false;
    }
    static fixeAvecIndisponibles(catalogue: Catalogue, avecIndisponibles: boolean) {
        catalogue._avecIndisponibles = avecIndisponibles;
        catalogue._apiCommande = undefined;
    }

    static ajoutePrixDatés(catalogue: Catalogue, anciens: CatalogueApi[]) {
        let prixAnciens: PrixDaté[] = [];
        anciens.forEach(a => {
            prixAnciens = prixAnciens.concat(a.produits
                .map(p => {
                    const pp = new PrixDaté();
                    pp.no = p.no;
                    pp.date = a.date;
                    pp.prix = p.prix;
                    return pp;
                })
            );
        });
        catalogue.prixDatés = prixAnciens;
    }

    static prixDaté(catalogue: Catalogue, no: number, date: Date): number {
        if (catalogue.prixDatés) {
            const prixAvant = catalogue.prixDatés
                .filter(pd => pd.no === no)
                .sort((pd1, pd2) => pd1.date < pd2.date ? -1 : pd1.date === pd2.date ? 0 : 1)
                .filter(pd => pd.date <= date);
            if (prixAvant.length > 0) {
                return prixAvant[prixAvant.length - 1].prix;
            }
        }
        return catalogue.produits.find(p => p.no === no).prix;
    }

    static apiCommande(catalogue: Catalogue): ApiCommande {
        return catalogue._apiCommande;
    }
    static fixeApiCommande(catalogue: Catalogue, apiCommande: ApiCommande) {
        catalogue._apiCommande = apiCommande;
        catalogue._avecIndisponibles = undefined;
    }
}
