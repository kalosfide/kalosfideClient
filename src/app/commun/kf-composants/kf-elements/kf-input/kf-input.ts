import { KfTypeDeComposant, KfTypeDeValeur } from '../../kf-composants-types';
import { KfTexteImage } from '../../kf-partages/kf-texte-image/kf-texte-image';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';

export enum KfTypeDInput {
    date = 'date',
    email = 'email',
    nombre = 'number',
    password = 'password',
    texte = 'text',
}

export abstract class KfInput extends KfEntrée {
    // données
    texteParDéfaut: '';
    abstract typeDInput: string;

    constructor(nom: string,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, KfTypeDeComposant.input, texte, imageAvant, imageApres);
        this._valeur = null;
    }

    // données
    depuisForm() {
        this.fixeValeur(this.formControl.value);
    }
    versForm() {
        this.formControl.setValue(this.litValeur());
    }

}
