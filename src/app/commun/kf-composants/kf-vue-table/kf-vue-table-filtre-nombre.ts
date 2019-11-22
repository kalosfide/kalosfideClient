import { KfListeDeroulanteBase } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-base';
import {
    KfListeDeroulanteNombre} from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';
import { KfBBtnToolbarInputGroup } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export class KfVueTableFiltreNombre<T> extends KfVueTableFiltreBase<T> {
    private _liste: KfListeDeroulanteNombre;

    constructor(nom: string, valide: (t: T, valeur: number) => boolean) {
        super(nom);
        this._valide = valide;

        this._liste = new KfListeDeroulanteNombre(nom + '_L');
    }

    get liste(): KfListeDeroulanteNombre {
        return this._liste;
    }

    get composant(): KfBBtnToolbarInputGroup {
        return this._liste;
    }
}
