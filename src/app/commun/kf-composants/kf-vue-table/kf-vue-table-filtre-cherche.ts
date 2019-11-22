import { KfInputTexte } from '../kf-elements/kf-input/kf-input-texte';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';

export class KfVueTableFiltreCherche<T> extends KfVueTableFiltreBase<T> {
    private _texte: KfInputTexte;

    constructor(nom: string, texte: (t: T) => string) {
        super(nom);
        this._valide = (t: T, valeur: string) => texte(t).toLowerCase().indexOf(valeur.toLowerCase()) > -1;

        this._texte = new KfInputTexte(nom + '_T');
    }

    get texte(): KfInputTexte {
        return this._texte;
    }

    get composant(): KfInputTexte {
        return this._texte;
    }
}
