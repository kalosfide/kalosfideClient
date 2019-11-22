import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfInputTexte } from '../kf-elements/kf-input/kf-input-texte';
import { KfListeDeroulanteBase } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-base';
import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { KfVueTableOutils } from './kf-vue-table-outils';
import { IKfVueTableOutil } from './kf-vue-table-outil';
import { KfBBtnToolbarElement, KfBBtnToolbarInputGroup } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export abstract class KfVueTableFiltreBase<T> implements IKfVueTableOutil<T> {
    private _nom: string;

    protected _valide: (t: T, valeur: string | number) => boolean;

    constructor(nom: string) {
        this._nom = nom;
    }

    get nom(): string {
        return this._nom;
    }

    abstract get composant(): KfBBtnToolbarInputGroup;

    get filtreActif(): boolean {
        const valeur = this.composant.gereValeur.valeur;
        return valeur !== undefined && valeur !== null && valeur !== '';
    }

    get valide(): (t: T) => boolean {
        if (this._valide) {
            return (t: T) => {
                const valeur = this.composant.valeur;
                return valeur ? this._valide(t, valeur) : true;
            };
        }
    }

    initialise(parent: KfVueTableOutils<T>) {
        this.composant.estRacineV = true;
        this.composant.gereHtml.suitLaValeur = true;
        this.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            (evenement: KfEvenement) => {
                parent.appliqueFiltres();
            });
    }

}
