import { KfTypeDeComposant, KfTypeDeValeur } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTexteImage } from '../../kf-partages/kf-texte-image';
import { KfEntrée } from '../../kf-composant/kf-entree';

export enum TypeDeParamètre {
    Aucun,
    Chaine,
    Nombre,
    Entier,
    Longueur,
    Angle,
    AngleEnRadians,
    AngleDeDroites,
    AngleDeDroitesEnRadians,
    Complexe,
    DansArbre,
    DansListe,
    Liste,
    Dictionnaire,
    Racine
}

export class KfTexte extends KfEntrée {
    // données
    texteParDéfaut: '';
    typeDInput: string;

    constructor(nom: string,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        super(nom, KfTypeDeComposant.texte, texte, imageAvant, imageApres);
        this.typeDInput = 'text';
        this._valeur = null;
    }

    get valeur(): string {
        return this.litValeur() as string;
    }
    set valeur(valeur: string) {
        this.fixeValeur(valeur);
    }

    // données
    depuisForm() {
        this.valeur = this.formControl.value;
    }
    versForm() {
        this.formControl.setValue(this.valeur);
    }

}
