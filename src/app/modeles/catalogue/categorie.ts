import { KeyUidRnoNo, IKeyUidRnoNoData } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';

export interface ICategorieData extends IKeyUidRnoNoData {
    no: number;
    nom: string;
}

export class Categorie extends KeyUidRnoNo implements ICategorieData {
    nom: string;
    nbProduits: number;

    copieData(d: CategorieData) {
        this.nom = d.nom;
    }
}

export class CategorieData implements ICategorieData {
    no: number;
    nom: string;
}
