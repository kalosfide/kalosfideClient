import { KfListeDeroulanteBase } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-base';
import {
    KfListeDeroulanteTexte} from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';
import { KfBBtnToolbarInputGroup } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export class KfVueTableFiltreTexte<T> extends KfVueTableFiltreBase<T> {
    private _liste: KfListeDeroulanteTexte;

    constructor(nom: string, valide: (t: T, valeur: string) => boolean) {
        super(nom);
        this._valide = valide;

        this._liste = new KfListeDeroulanteTexte(nom + '_L');
    }

    get liste(): KfListeDeroulanteTexte {
        return this._liste;
    }

    get composant(): KfBBtnToolbarInputGroup {
        return this._liste;
    }
}
