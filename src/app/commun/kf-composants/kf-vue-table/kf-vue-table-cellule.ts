import { KfComposant } from '../kf-composant/kf-composant';
import { KfVueTableColonne } from './kf-vue-table-colonne';
import { KfVueTable } from './kf-vue-table';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../kf-partages/kf-texte-def';

export interface IKfVueTableCelluleDef {
    texteDef?: () => string;
    composant?: KfComposant;
}

export type KfVueTableCelluleDef = string | IKfVueTableCelluleDef;

export interface IKfVueTableCellule {
    composant: KfComposant;
    classe?: KfNgClasse;
    colSpan?: number;
}

export abstract class KfVueTableCelluleBase<T> {
    protected _vueTable: KfVueTable<T>;
    protected _colonne: KfVueTableColonne<T>;
    protected _index: number;
    protected _composant: KfComposant;

    protected _colSpan: number | (() => number);
    private _rowSpan: number;
    protected _nePasAfficher: boolean | (() => boolean);

    th_scope: string;

    constructor(vueTable: KfVueTable<T>, colonne: KfVueTableColonne<T>, index: number) {
        this._vueTable = vueTable;
        this._colonne = colonne;
        this._index = index;
    }

    get vueTable(): KfVueTable<T> {
        return this._vueTable;
    }

    get colonne(): KfVueTableColonne<T> {
        return this._colonne;
    }

    get colSpan(): number {
        if (this._colSpan !== undefined) {
            if (typeof (this._colSpan) === 'number') {
                return this._colSpan;
            } else {
                return this._colSpan();
            }
        }
    }

    set colSpan(valeur: number) {
        this._colSpan = valeur;
    }

    get rowSpan(): number {
        return this._rowSpan;
    }

    set rowSpan(valeur: number) {
        this._rowSpan = valeur;
    }

    get nePasAfficher(): boolean {
        if (this._nePasAfficher !== undefined) {
            if (typeof (this._nePasAfficher) === 'boolean') {
                return this._nePasAfficher || this._colonne.nePasAfficher;
            } else {
                return this._nePasAfficher();
            }
        } else {
            return this._colonne.nePasAfficher;
        }
    }
    set nePasAfficher(valeur: boolean) {
        this._nePasAfficher = valeur;
    }

    protected créeComposant(celluleDef: KfVueTableCelluleDef): KfComposant {
        let texteDef: KfTexteDef;
        if (!celluleDef) {
            texteDef = '';
        } else {
            if (typeof (celluleDef) === 'string') {
                texteDef = celluleDef;
            } else {
                if (celluleDef.composant !== undefined) {
                    return celluleDef.composant;
                } else {
                    texteDef = celluleDef.texteDef !== undefined ? celluleDef.texteDef : '';
                }
            }
        }
        return new KfEtiquette('e' + (this._index + 1), texteDef);
    }

    get composant(): KfComposant {
        return this._composant;
    }

}

export class KfVueTableCellule<T> extends KfVueTableCelluleBase<T> implements IKfVueTableCellule {
    item: T;

    constructor(vueTable: KfVueTable<T>, colonne: KfVueTableColonne<T>, index: number, item: T) {
        super(vueTable, colonne, index);
        this.item = item;
        this._composant = this.créeComposant(this._colonne.créeContenu(this.item));
    }

    get classe(): KfNgClasse {
        return this._colonne.classeItem(this.item);
    }
}

export class KfVueTableCelluleBilan<T> extends KfVueTableCelluleBase<T> implements IKfVueTableCellule {

    constructor(vueTable: KfVueTable<T>, colonne: KfVueTableColonne<T>, ligneDesVisibles?: boolean) {
        super(vueTable, colonne, colonne.index);
        this.initialise(ligneDesVisibles);
        this.th_scope = 'col';
    }

    initialise(ligneDesVisibles: boolean) {
        const bilanDef = this._colonne.bilanDef;
        if (bilanDef) {
            // c'est une cellule avec bilan
            this._composant = this.créeComposant(bilanDef.valeurDef ? bilanDef.valeurDef : '');
            this._nePasAfficher = () => this._colonne.nePasAfficher;
            let texteDef: () => string;
            if (bilanDef.texteAgrégé) {
                const etiquette = this._composant as KfEtiquette;
                if (ligneDesVisibles) {
                    texteDef = () => bilanDef.texteAgrégé(this.vueTable.lignes.filter(l => l.passeFiltres).map(l => l.item));
                } else {
                    texteDef = () => bilanDef.texteAgrégé(this.vueTable.lignes.map(l => l.item));
                }
                etiquette.fixeTexte(texteDef);
            }
        } else {
            const colonnes = this.vueTable.colonnes;
            const index = this._colonne.index;
            const colonneAvecBilanSuivante = colonnes.slice(index + 1).find(c => c.bilanDef !== undefined && c.bilanDef !== null);
            if (colonneAvecBilanSuivante === undefined) {
                // les cellules qui suivent la dernière cellule de bilan sont affichèes si leur colonne l'est
                this._composant = this.créeComposant('');
                this.nePasAfficher = this._colonne.nePasAfficher;
            } else {
                if (colonneAvecBilanSuivante.index === index + 1) {
                    // une cellule qui précède une cellule de bilan qui a un titre s'étale sur toutes les colonnes
                    // affichées qui suivent la cellule de bilan précédente
                    const bilanSuivant = colonneAvecBilanSuivante.bilanDef;
                    const titre = ligneDesVisibles && bilanSuivant.titreVisiblesSeulement
                        ? bilanSuivant.titreVisiblesSeulement
                        : bilanSuivant.titreDef
                            ? bilanSuivant.titreDef
                            : '';
                    this._composant = this.créeComposant(titre);
                    this._colSpan = () => {
                        let colSpan = this._colonne.nePasAfficher ? 0 : 1;
                        for (let i = index - 1; i >= 0; i--) {
                            const colonne = this.vueTable.colonnes[i];
                            if (!colonne.nePasAfficher) {
                                if (colonne.bilanDef) {
                                    break;
                                } else {
                                    colSpan++;
                                }
                            }
                        }
                        return colSpan;
                    };
                    this._nePasAfficher = () => colonneAvecBilanSuivante.nePasAfficher;
                } else {
                    this._composant = this.créeComposant('');
                    this.nePasAfficher = true;
                }
            }
        }
    }

    get classe(): KfNgClasse {
        return this._colonne.classeBilan;
    }
}
