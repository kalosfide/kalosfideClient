import { KfComposant } from '../kf-composant/kf-composant';
import { KfVueTableColonne } from './kf-vue-table-colonne';
import { KfVueTable } from './kf-vue-table';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { Tri } from '../../outils/trieur';
import { KfIcone } from '../kf-elements/kf-icone/kf-icone';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { FANomIcone } from '../kf-partages/kf-icone-def';
import { IKfVueTableBilanDef } from './i-kf-vue-table-bilan-def';

export interface IKfVueTableCelluleDef {
    texteDef?: () => string;
    composant?: KfComposant;
}

export type KfVueTableCelluleDef = string | IKfVueTableCelluleDef;

export interface IKfVueTableCellule {
    composant: KfComposant;
    classe?: KfNgClasse;
    colSpan?: number;
    avecTexte?: boolean;
}

export abstract class KfVueTableCelluleBase<T> {
    protected _vueTable: KfVueTable<T>;
    protected _colonne: KfVueTableColonne<T>;
    protected _index: number;
    protected _composant: KfComposant;

    private _colSpan: number;
    private _rowSpan: number;
    private _nePasAfficher: boolean;

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
        return this._colSpan;
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
        return this._nePasAfficher || this._colonne.nePasAfficher;
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
            this._composant = this.créeComposant(bilanDef.valeurDef ? bilanDef.valeurDef : '');
            this.nePasAfficher = this._colonne.nePasAfficher;
            let texteDef: () => string;
            if (bilanDef.agrégation) {
                const etiquette = this._composant as KfEtiquette;
                if (ligneDesVisibles) {
                    if (bilanDef.formate) {
                        texteDef = () => bilanDef.formate(this._agrègeVisiblesSeulement(bilanDef));
                    } else {
                        texteDef = () => this._agrègeVisiblesSeulement(bilanDef);
                    }
                } else {
                    if (bilanDef.formate) {
                        texteDef = () => {
                            return bilanDef.formate(this._agrègeTout(bilanDef));
                        };
                    } else {
                        texteDef = () => this._agrègeTout(bilanDef);
                    }
                }
                etiquette.fixeTexte(texteDef);
            }
        } else {
            const colonnes = this.vueTable.colonnes;
            const index = this._colonne.index;
            const colonneAvecBilanSuivante = colonnes.slice(index + 1).find(c => c.bilanDef !== undefined && c.bilanDef !== null);
            if (colonneAvecBilanSuivante === undefined) {
                this._composant = this.créeComposant('');
                this.nePasAfficher = this._colonne.nePasAfficher;
            } else {
                if (colonneAvecBilanSuivante.index === index + 1) {
                    const bilanSuivant = colonneAvecBilanSuivante.bilanDef;
                    this._composant = this.créeComposant(ligneDesVisibles && bilanSuivant.titreVisiblesSeulement
                        ? bilanSuivant.titreVisiblesSeulement
                        : bilanSuivant.titreDef);
                    let colSpan = 1;
                    for (let i = index - 1; i >= 0; i--) {
                        if (this.vueTable.colonnes[i].bilanDef) {
                            break;
                        } else {
                            colSpan++;
                        }
                    }
                    this.colSpan = colSpan;
                    this.nePasAfficher = colonneAvecBilanSuivante.nePasAfficher;
                } else {
                    this._composant = this.créeComposant('');
                    this.nePasAfficher = true;
                }
            }
        }
    }

    private _agrègeTout(bilanDef: IKfVueTableBilanDef<T>): any {
        let v: any = bilanDef.valeur0;
        const agrégation = bilanDef.agrégation;
        this.vueTable.lignes.forEach(l => {
            v = agrégation(v, l.item);
        });
        return v;
    }

    private _agrègeVisiblesSeulement(bilanDef: IKfVueTableBilanDef<T>): any {
        let v: any = bilanDef.valeur0;
        const agrégation = bilanDef.agrégation;
        this.vueTable.lignes.filter(l => l.passeFiltres).forEach(l => {
            v = agrégation(v, l.item);
        });
        return v;
    }

    get classe(): KfNgClasse {
        return this._colonne.classeBilan;
    }
}
