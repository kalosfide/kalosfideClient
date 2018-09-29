import { KfTypeDeComposant, KfTypeDeValeur } from '../../kf-composants-types';
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

export class KfNombre extends KfEntrée {
    // données
    texteParDéfaut: '';
    typeDInput: string;

    constructor(nom: string,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        super(nom, KfTypeDeComposant.nombre, texte, imageAvant, imageApres);
        this.typeDInput = 'number';
        this._valeur = null;
    }

    get valeur(): number {
        return this.litValeur() as number;
    }
    set valeur(valeur: number) {
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
