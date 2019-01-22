import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';

export class ProduitPrix extends KeyUidRnoNo {
    nomCategorie?: string;
    nomProduit?: string;
    etats: EtatPrix[];
}

export class EtatPrix {
    date?: string;
    prix: number;
}
export function textePrix(prix: number): string {
    return prix.toLocaleString('fr-FR', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    }) + ' €';
}
