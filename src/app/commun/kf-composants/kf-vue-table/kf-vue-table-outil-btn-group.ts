import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { IKfVueTableOutil } from './kf-vue-table-outil';
import { KfBBtnGroup, KfBBtnGroupElement } from '../kf-b-btn-group/kf-b-btn-group';
import { KfBBtnToolbarElement } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export class KfVueTableOutilBtnGroupe<T> implements IKfVueTableOutil<T> {
    private _composant: KfBBtnGroup;
    private _nom: string;

    constructor(nom: string, ...contenus: KfBBtnGroupElement[]) {
        this._nom = nom;
        this._composant = new KfBBtnGroup(nom);
        contenus.forEach(c => this.bbtnGroup.ajoute(c));
    }

    get bbtnGroup(): KfBBtnGroup {
        return this._composant as KfBBtnGroup;
    }

    get nom(): string {
        return this._nom;
    }

    get composant(): KfBBtnToolbarElement {
        return this._composant;
    }
}
