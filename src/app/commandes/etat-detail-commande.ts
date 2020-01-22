import { DetailCommande } from './detail-commande';
import { KfOptionTexte } from '../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-option-texte';

export enum IdEtatDetailCommande {
    tout = 'T',
    àPréparer = 'A',
    préparé = 'P',
    refusé = 'R',
    facturé = 'F'
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
    vérifie: (c: DetailCommande) => !c.préparé
};

const préparé: EtatDetailCommandeDef = {
    valeur: IdEtatDetailCommande.préparé,
    texte: 'prêts',
    vérifie: (c: DetailCommande) => c.préparé
};

const refusé: EtatDetailCommandeDef = {
    valeur: IdEtatDetailCommande.refusé,
    texte: 'refusés',
    vérifie: (c: DetailCommande) => c.refusé
};

const facturé: EtatDetailCommandeDef = {
    valeur: IdEtatDetailCommande.facturé,
    texte: 'facturés',
    vérifie: (c: DetailCommande) => c.facturée
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
        vérifie: (c: DetailCommande) => !c.préparé
    };

    prêt: EtatDetailCommandeDef = {
        valeur: IdEtatDetailCommande.préparé,
        texte: 'prêts',
        vérifie: (c: DetailCommande) => c.préparé
    };

    refusé: EtatDetailCommandeDef = {
        valeur: IdEtatDetailCommande.refusé,
        texte: 'refusés',
        vérifie: (c: DetailCommande) => c.refusé
    };

    get liste(): EtatDetailCommandeDef[] {
        return [tout, àPréparer, préparé, refusé];
    }

    étatDeId(id: IdEtatDetailCommande): EtatDetailCommandeDef {
        switch (id) {
            case IdEtatDetailCommande.tout:
                return tout;
            case IdEtatDetailCommande.àPréparer:
                return àPréparer;
            case IdEtatDetailCommande.préparé:
                return préparé;
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
