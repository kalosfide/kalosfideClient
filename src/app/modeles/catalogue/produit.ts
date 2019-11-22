import { KeyUidRnoNo, IKeyUidRnoNoData, GroupeUidRnoNo } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { compareMinuscules } from '../../commun/outils/compare';
import { TypeMesure } from '../type-mesure';
import { TypeCommande } from '../type-commande';

export interface IAvecProduit {
    produit: Produit;
}

export class Produit extends KeyUidRnoNo implements IAvecProduit {
    nom: string;
    categorieNo: number;
    typeCommande: string;
    typeMesure: string;
    prix: number;
    etat: string;
    nomCategorie?: string;

    get produit(): Produit {
        return this;
    }

    copieData(d: ProduitData) {
        this.nom = d.nom;
        this.categorieNo = d.categorieNo;
        this.typeCommande = d.typeCommande;
        this.typeMesure = d.typeMesure;
        this.prix = d.prix;
        this.etat = d.etat;
    }

}

export class ProduitData implements IKeyUidRnoNoData {
    no: number;
    nom: string;
    categorieNo: number;
    typeCommande: string;
    typeMesure: string;
    prix: number;
    etat: string;
}

class CCompareProduits {
    nom(p1: Produit, p2: Produit): number {
        return compareMinuscules(p1.nom, p2.nom);
    }
    nomCategorie(p1: Produit, p2: Produit): number {
        return compareMinuscules(p1.nomCategorie, p2.nomCategorie);
    }
}
export const CompareProduits = new CCompareProduits();

export class CompareProduits1 {}
