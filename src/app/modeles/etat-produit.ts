import { Produit } from './produit';

export enum IdEtatProduit {
    tous = 'T',
    disponible = 'D',
    indisponible = 'I',
}

export const IdsEtatsProduits: string[] = [
    IdEtatProduit.tous,
    IdEtatProduit.disponible,
    IdEtatProduit.indisponible,
];

export class EtatProduit {
    valeur: IdEtatProduit;
    texte: string;
    vérifie: (p: Produit) => boolean;
}

const tous: EtatProduit = {
    valeur: IdEtatProduit.tous,
    texte: '',
    vérifie: (p: Produit) => true
};
const disponible: EtatProduit = {
    valeur: IdEtatProduit.disponible,
    texte: 'disponibles',
    vérifie: (p: Produit) => p.prix > 0
};
const indisponible: EtatProduit = {
    valeur: IdEtatProduit.indisponible,
    texte: 'indisponibles',
    vérifie: (p: Produit) => p.prix === 0
};
class CEtatsProduits {
    tous = tous;
    disponible = disponible;
    indisponible = indisponible;
    etats: EtatProduit[] = [tous, disponible, indisponible];
    etat(id: IdEtatProduit): EtatProduit {
        return this.etats.find(e => e.valeur === id);
    }
}
export const EtatsProduits = new CEtatsProduits();
