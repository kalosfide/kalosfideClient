import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export enum KfTypeDInput {
    date = 'date',
    temps = 'time',
    datetemps = 'datetemps',
    email = 'email',
    nombre = 'number',
    password = 'password',
    texte = 'text',
}

export abstract class KfInput extends KfEntrée {
    // données
    texteParDéfaut: '';
    abstract typeDInput: string;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.input);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
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
