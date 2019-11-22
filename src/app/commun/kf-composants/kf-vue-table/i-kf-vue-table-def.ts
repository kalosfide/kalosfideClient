import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfVueTableOutils } from './kf-vue-table-outils';

export interface IKfVueTableDef<T> {
    colonnesDef: IKfVueTableColonneDef<T>[];

    /**
     * si avecEnTêtesDeLigne est vrai, la première cellule de chaque ligne est dans un th
     */
    avecEnTêtesDeLigne?: boolean;

    /**
     * pour donner une valeur à chaque ligne et à la vueTable
     */
    superGroupe?: (item: T) => KfSuperGroupe;

    /**
     * pour ajouter classe et style à l'élément tr de l'item
     */
    gereCss?: (item: T) => KfGèreCss;

    /**
     * pour ajouter à l'élément tr de l'item un attribut id
     */
    id?: (item: T) => string;

    /**
     * pour ajouter dans une colonne invisible, les champs non éditables du superGroupe de l'item
     */
    composantsAValider?: (item: T) => KfComposant[];

    /**
     *
     */
    outils?: KfVueTableOutils<T>;

}
