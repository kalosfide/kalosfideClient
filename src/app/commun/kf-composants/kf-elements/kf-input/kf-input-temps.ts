import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfInput, KfTypeDInput } from './kf-input';
import { DateFr } from 'src/app/commun/outils/date-fr';
import { Dateur } from 'src/app/commun/outils/dateur';

export class KfInputTemps extends KfInput {
    typeDInput: KfTypeDInput;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, texte);
        this.typeDInput = KfTypeDInput.temps;
        this._valeur = null;
    }

    get valeur(): string {
        return this.litValeur() as string;
    }
    set valeur(valeur: string) {
        this.fixeValeur(valeur);
    }

    get temps(): Date {
        const texte = this.litValeur();
        if (texte) {
            const ts = texte.toString().split(':');
            const h = Number.parseInt(ts[0], 10);
            const min = Number.parseInt(ts[0], 10);
            return new Date((h * 60 + min) * 60000);
        }
        return null;
    }
    set temps(valeur: Date) {
        this.fixeValeur(Dateur.InputTimeValue(valeur));
    }

}
