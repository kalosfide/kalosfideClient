import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfInput, KfTypeDInput } from './kf-input';

export class KfNombre extends KfInput {
    typeDInput: KfTypeDInput;
    min: number;
    max: number;
    pas: number;

    constructor(nom: string,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, texte, imageAvant, imageApres);
        this.typeDInput = KfTypeDInput.nombre;
        this._valeur = null;
    }

    get valeur(): number {
        return this.litValeur() as number;
    }
    set valeur(valeur: number) {
        this.fixeValeur(valeur);
    }

}
