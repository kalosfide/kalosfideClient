import { DetailCommande } from 'src/app/commandes/detail-commande';

export enum IdEtatCommandeLigne {
    tous = 'T',
    avecDemande = 'D',
    sansDemande = 'S',
}

export const IdsEtatsCommandeLignes: string[] = [
    IdEtatCommandeLigne.tous,
    IdEtatCommandeLigne.avecDemande,
    IdEtatCommandeLigne.sansDemande,
];

export class EtatCommandeLigne {
    valeur: IdEtatCommandeLigne;
    texte: string;
    vérifie: (p: DetailCommande) => boolean;
}

const tous: EtatCommandeLigne = {
    valeur: IdEtatCommandeLigne.tous,
    texte: '',
    vérifie: (p: DetailCommande) => true
};
const avecDemande: EtatCommandeLigne = {
    valeur: IdEtatCommandeLigne.avecDemande,
    texte: 'avec demande',
    vérifie: (cl: DetailCommande) => cl.demande > 0
};
const sansDemande: EtatCommandeLigne = {
    valeur: IdEtatCommandeLigne.sansDemande,
    texte: 'sans demande',
    vérifie: (cl: DetailCommande) => cl.demande <= 0
};
class CEtatsCommandeLignes {
    tous = tous;
    avecDemande = avecDemande;
    sansDemande = sansDemande;
    etats: EtatCommandeLigne[] = [tous, avecDemande, sansDemande];
    etat(id: IdEtatCommandeLigne): EtatCommandeLigne {
        return this.etats.find(e => e.valeur === id);
    }
}
export const EtatsCommandeLignes = new CEtatsCommandeLignes();
