import { KeyUidRnoNo, IKeyUidRnoNoData } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';

export class Categorie extends KeyUidRnoNo {
    nom: string;
    nbProduits: number;

    copieData(d: CategorieData) {
        this.nom = d.nom;
    }
}

export class CategorieData implements IKeyUidRnoNoData {
    no: number;
    nom: string;
}
