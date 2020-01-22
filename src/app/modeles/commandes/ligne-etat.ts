import { KfOptionTexte } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-option-texte';
import { LigneDocument } from './ligne-base';

export enum IdEtatLigneDocument {
    tout = 'T',
    àPréparer = 'A',
    préparé = 'P',
    refusé = 'R',
}

class EtatLigneDocumentDef {
    valeur: IdEtatLigneDocument;
    texte: string;
    vérifie: (commande: LigneDocument) => boolean;
}

const tout: EtatLigneDocumentDef = {
    valeur: IdEtatLigneDocument.tout,
    texte: '',
    vérifie: (c: LigneDocument) => true
};

const àPréparer: EtatLigneDocumentDef = {
    valeur: IdEtatLigneDocument.àPréparer,
    texte: 'à préparer',
    vérifie: (c: LigneDocument) => !c.préparé
};

const préparé: EtatLigneDocumentDef = {
    valeur: IdEtatLigneDocument.préparé,
    texte: 'prêts',
    vérifie: (c: LigneDocument) => c.préparé
};

const refusé: EtatLigneDocumentDef = {
    valeur: IdEtatLigneDocument.refusé,
    texte: 'refusés',
    vérifie: (c: LigneDocument) => c.annulé
};

export class EtatLigneDocument {

    static tout: EtatLigneDocumentDef = {
        valeur: IdEtatLigneDocument.tout,
        texte: '',
        vérifie: (c: LigneDocument) => true
    };

    static àPréparer: EtatLigneDocumentDef = {
        valeur: IdEtatLigneDocument.àPréparer,
        texte: 'à préparer',
        vérifie: (c: LigneDocument) => !c.préparé
    };

    static prêt: EtatLigneDocumentDef = {
        valeur: IdEtatLigneDocument.préparé,
        texte: 'prêts',
        vérifie: (c: LigneDocument) => c.préparé
    };

    static refusé: EtatLigneDocumentDef = {
        valeur: IdEtatLigneDocument.refusé,
        texte: 'refusés',
        vérifie: (c: LigneDocument) => c.annulé
    };

    static get liste(): EtatLigneDocumentDef[] {
        return [tout, àPréparer, préparé, refusé];
    }

    static étatDeId(id: IdEtatLigneDocument): EtatLigneDocumentDef {
        switch (id) {
            case IdEtatLigneDocument.tout:
                return tout;
            case IdEtatLigneDocument.àPréparer:
                return àPréparer;
            case IdEtatLigneDocument.préparé:
                return préparé;
            case IdEtatLigneDocument.refusé:
                return refusé;
            default:
                break;
        }
    }

    option(etat: EtatLigneDocumentDef): KfOptionTexte {
        const option = new KfOptionTexte(etat.valeur);
        option.fixeTexte(etat.texte);
        return option;
    }
}
