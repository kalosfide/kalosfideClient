import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfInput, KfTypeDInput } from './kf-input';

export class KfDate extends KfInput {
    typeDInput: KfTypeDInput;

    constructor(nom: string,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, texte, imageAvant, imageApres);
        this.typeDInput = KfTypeDInput.date;
        this._valeur = null;
    }

    get valeur(): Date {
        return this.litValeur() as Date;
    }
    set valeur(valeur: Date) {
        this.fixeValeur(valeur);
    }

}
