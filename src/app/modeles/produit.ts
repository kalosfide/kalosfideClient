import { KeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';

export class Produit extends KeyUidRnoNo {
    nom: string;
    categorieNo: number;
    typeCommande: string;
    typeMesure: string;
    nomCategorie: string;
    prix: number;
}

function _compare(s1: string, s2: string): number {
    const n1 = s1.toLocaleLowerCase();
    const n2 = s2.toLocaleLowerCase();
    return n1 < n2 ? -1 : n1 === n2 ? 0 : 1;
}
class CCompareProduits {
    nom(p1: Produit, p2: Produit): number {
        return _compare(p1.nom, p2.nom);
    }
    nomCategorie(p1: Produit, p2: Produit): number {
        return _compare(p1.nomCategorie, p2.nomCategorie);
    }
}
export const CompareProduits = new CCompareProduits();
