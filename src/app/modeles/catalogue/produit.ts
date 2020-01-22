import { KeyUidRnoNo, IKeyUidRnoNoData } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { ProduitEditeur } from './produit-editeur';
import { PrixDaté } from './prix-date';

export interface IAvecProduit {
    produit: Produit;
}

export interface IProduitData extends IKeyUidRnoNoData {
    no: number;
    nom: string;
    categorieNo: number;
    typeCommande: string;
    typeMesure: string;
    prix: number;
    etat: string;
    nbDétails: number;
}

export class Produit extends KeyUidRnoNo implements IAvecProduit, IProduitData {
    nom: string;
    categorieNo: number;
    typeCommande: string;
    typeMesure: string;
    prix: number;
    // présents pour le fournisseur
    etat: string;
    nbDétails: number;

    // affecté à la création
    nomCategorie?: string;

    editeur?: ProduitEditeur;

    get produit(): Produit {
        return this;
    }

    /**
     * Ne copie que les valeurs définies
     * @param de data source
     * @param vers data destination
     */
    static copieData(de: ProduitData, vers: ProduitData) {
        if (de.nom) { vers.nom = de.nom; }
        if (de.categorieNo) { vers.categorieNo = de.categorieNo; }
        if (de.typeCommande) { vers.typeCommande = de.typeCommande; }
        if (de.typeMesure) { vers.typeMesure = de.typeMesure; }
        if (de.prix) { vers.prix = de.prix; }
        if (de.etat) { vers.etat = de.etat; }
        if (de.nbDétails !== null && de.nbDétails !== undefined) { vers.nbDétails = de.nbDétails; }
    }

    copieEditeur() {
        this.nom = this.editeur.kfNom.valeur;
        this.categorieNo = this.editeur.kfCategorieNo.valeur;
        this.typeCommande = this.editeur.kfTypeCommande.valeur;
        this.typeMesure = this.editeur.kfTypeMesure.valeur;
        this.prix = this.editeur.kfPrix.valeur;
        this.etat = this.editeur.kfEtat.valeur;
    }

    apiProduit(): Produit {
        const produit = new Produit();
        KeyUidRnoNo.copieKey(this, produit);
        this.copieEditeur();
        Produit.copieData(this, produit);
        return produit;
    }

    get apiProduitPrix(): Produit {
        const produit = new Produit();
        KeyUidRnoNo.copieKey(this, produit);
        this.prix = this.editeur.kfPrix.valeur;
        produit.prix = this.prix;
        return produit;
    }

    get apiProduitEtat(): Produit {
        const produit = new Produit();
        KeyUidRnoNo.copieKey(this, produit);
        this.etat = this.editeur.kfEtat.valeur;
        produit.etat = this.etat;
        return produit;
    }

}

export class ProduitData implements IProduitData {
    no: number;
    nom: string;
    categorieNo: number;
    typeCommande: string;
    typeMesure: string;
    prix: number;
    etat: string;
    nbDétails: number;
}

