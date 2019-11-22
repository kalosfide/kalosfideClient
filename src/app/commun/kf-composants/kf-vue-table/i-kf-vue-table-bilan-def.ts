import { KfVueTableCelluleDef } from './kf-vue-table-cellule';

export interface IKfVueTableBilanDef<T> {
    /**
     * Si présent et si la colonne est précédée de colonnes sans bilan, le titre s'étalera sur ces colonnes
     */
    titreDef: KfVueTableCelluleDef;

    /**
     * Si agrégation des valeurs ne sert que pour la classe css
     */
    valeurDef?: KfVueTableCelluleDef;

    /**
     * Si présent, une étiquette vide est crée pour afficher la valeur agrégée de la colonne
     */
    agrégation?: (agrégé: any, item: T) => any;

    /**
     * Valeur initiale de l'agrégation
     */
    valeur0?: any;

    /**
     * Si vrai, seules les valeurs des lignes qui passent les filtres sont agrégées
     */
    visiblesSeulement?: boolean;

    /**
     * Si présent dans l'une des colonnes, une autre ligne est affichée avec ce titre
     * où seules les valeurs des lignes qui passent les filtres sont agrégées
     */
    titreVisiblesSeulement?: KfVueTableCelluleDef;

    /**
     * Si présent, formate la valeur agrégée pour le texteDef à afficher
     */
    formate?: (agrégé: any) => string;
}
