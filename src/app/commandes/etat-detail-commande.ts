import { DetailCommande } from './detail-commande';
import { KfOptionTexte } from '../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-option-texte';

export enum IdEtatDetailCommande {
    tout = 'T',
    àPréparer = 'A',
    prêt = 'P',
    refusé = 'R',
}

class EtatDetailCommandeDef {
    valeur: IdEtatDetailCommande;
    texte: string;
    vérifie: (commande: DetailCommande) => boolean;
}

const tout: EtatDetailCommandeDef = {
    valeur: IdEtatDetailCommande.tout,
    texte: '',
    vérifie: (c: DetailCommande) => true
};

const àPréparer: EtatDetailCommandeDef = {
    valeur: IdEtatDetailCommande.àPréparer,
    texte: 'à préparer',
    vérifie: (c: DetailCommande) => !c.prêt
};

const prêt: EtatDetailCommandeDef = {
    valeur: IdEtatDetailCommande.prêt,
    texte: 'prêts',
    vérifie: (c: DetailCommande) => c.prêt
};

const refusé: EtatDetailCommandeDef = {
    valeur: IdEtatDetailCommande.refusé,
    texte: 'refusés',
    vérifie: (c: DetailCommande) => c.refusé
};

class CEtatDetailCommande {

    tout: EtatDetailCommandeDef = {
        valeur: IdEtatDetailCommande.tout,
        texte: '',
        vérifie: (c: DetailCommande) => true
    };

    àPréparer: EtatDetailCommandeDef = {
        valeur: IdEtatDetailCommande.àPréparer,
        texte: 'à préparer',
        vérifie: (c: DetailCommande) => !c.prêt
    };

    prêt: EtatDetailCommandeDef = {
        valeur: IdEtatDetailCommande.prêt,
        texte: 'prêts',
        vérifie: (c: DetailCommande) => c.prêt
    };

    refusé: EtatDetailCommandeDef = {
        valeur: IdEtatDetailCommande.refusé,
        texte: 'refusés',
        vérifie: (c: DetailCommande) => c.refusé
    };

    get liste(): EtatDetailCommandeDef[] {
        return [tout, àPréparer, prêt, refusé];
    }

    étatDeId(id: IdEtatDetailCommande): EtatDetailCommandeDef {
        switch (id) {
            case IdEtatDetailCommande.tout:
                return tout;
            case IdEtatDetailCommande.àPréparer:
                return àPréparer;
            case IdEtatDetailCommande.prêt:
                return prêt;
            case IdEtatDetailCommande.refusé:
                return refusé;
            default:
                break;
        }
    }

    option(etat: EtatDetailCommandeDef): KfOptionTexte {
        const option = new KfOptionTexte(etat.valeur);
        option.fixeTexte(etat.texte);
        return option;
    }
}

export const EtatDetailCommande = new CEtatDetailCommande();
