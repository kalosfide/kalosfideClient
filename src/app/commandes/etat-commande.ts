import { Commande } from './commande';

export enum IdEtatCommande {
    tout = 'T',
    sansDétails = '0',
    incomplet = 'I',
    prêt = '1'
}

class EtatCommandeDef {
    id: IdEtatCommande;
    texte: string;
    vérifie: (commande: Commande) => boolean;
}

const tout: EtatCommandeDef = {
    id: IdEtatCommande.tout,
    texte: '',
    vérifie: (c: Commande) => true
};

const sansDétails: EtatCommandeDef = {
    id: IdEtatCommande.sansDétails,
    texte: 'vide',
    vérifie: (c: Commande) => c.sansDétails
};

const incomplet: EtatCommandeDef = {
    id: IdEtatCommande.incomplet,
    texte: 'incomplet',
    vérifie: (c: Commande) => c.incomplet
};

const prêt: EtatCommandeDef = {
    id: IdEtatCommande.prêt,
    texte: 'prêt',
    vérifie: (c: Commande) => c.préparé
};


export const EtatCommande = {
    tout: tout,
    sansDétails: sansDétails,
    incomplet: incomplet,
    prêt: prêt,
    liste: [sansDétails, incomplet, prêt],
    étatDeId: (id: IdEtatCommande) => {
        switch (id) {
            case IdEtatCommande.tout:
                return tout;
            case IdEtatCommande.sansDétails:
                return sansDétails;
            case IdEtatCommande.incomplet:
                return incomplet;
            case IdEtatCommande.prêt:
                return prêt;
            default:
                break;
        }
    }
};
