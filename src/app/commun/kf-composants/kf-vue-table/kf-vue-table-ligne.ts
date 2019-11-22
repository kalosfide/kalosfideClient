import { KfComposant } from '../kf-composant/kf-composant';
import {
    KfVueTableCellule, KfVueTableCelluleBase, KfVueTableCelluleBilan, IKfVueTableCellule
} from './kf-vue-table-cellule';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { FormGroup } from '@angular/forms';
import { KfVueTable } from './kf-vue-table';
import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

/** pour que le component soit indépendant du générique T */
export interface IKfVueTableLigne {
    cellules: IKfVueTableCellule[];
    passeFiltres?: boolean;
    formGroup?: FormGroup;
    id?: string;
}

export abstract class KfVueTableLigneBase<T> {
    protected _vueTable: KfVueTable<T>;
    protected _cellules: KfVueTableCelluleBase<T>[];
    protected _gereCss: KfGèreCss;

    constructor(vueTable: KfVueTable<T>) {
        this._vueTable = vueTable;
    }

    get vueTable(): KfVueTable<T> {
        return this._vueTable;
    }

    public get cellules(): IKfVueTableCellule[] {
        const cellulesVisibles = this._cellules.filter(cellule => !cellule.nePasAfficher);
        return cellulesVisibles;
    }

    public get composants(): KfComposant[] {
        return this._cellules.map(cellule => cellule.composant).filter(composant => !!composant);
    }

    get gèreCss(): KfGèreCss {
        return this._gereCss;
    }

    get classe(): KfNgClasse {
        if (this._gereCss) {
            return this._gereCss.classe;
        }
    }
    get style(): KfNgStyle {
        if (this._gereCss) {
            return this._gereCss.style;
        }
    }
}

export class KfVueTableLigne<T> extends KfVueTableLigneBase<T> implements IKfVueTableLigne {
    private _index: number;
    private _item: T;
    private _id: string;
    private _superGroupe: KfSuperGroupe;
    passeFiltres: boolean;

    constructor(vueTable: KfVueTable<T>, item: T, index: number) {
        super(vueTable);
        if (vueTable.superGroupe) {
            this._superGroupe = vueTable.superGroupe(item);
            this._superGroupe.listeParent = vueTable;
        }
        this._item = item;
        this._index = index;
        this._cellules = vueTable.colonnes.map(colonne => new KfVueTableCellule<T>(vueTable, colonne, index, item));
        if (vueTable.avecEnTêtesDeLigne) {
            this._cellules[0].th_scope = 'row';
        }
        this.passeFiltres = true;
        if (vueTable.id) {
            this._id = vueTable.id(item);
        }
        if (vueTable.gereCss) {
            this._gereCss = vueTable.gereCss(item);
        } else {
            if (vueTable.fixeChoisie) {
                this._gereCss = new KfGèreCss();
            }
        }
    }

    get choisie(): boolean {
        return this._index === this.vueTable.index;
    }

    public get index(): number {
        return this._index;
    }

    public get item(): T {
        return this._item;
    }

    get id(): string {
        return this._id;
    }

    public get superGroupe(): KfSuperGroupe {
        return this._superGroupe;
    }

    public get formGroup(): FormGroup {
        return this._superGroupe.formGroup;
    }

    public get composantsAValider(): KfComposant[] {
        return this._vueTable.composantsAValider(this._item);
    }
}

export class KfVueTableBilan<T> extends KfVueTableLigneBase<T> implements IKfVueTableLigne {

    constructor(vueTable: KfVueTable<T>, ligneDesVisibles?: boolean) {
        super(vueTable);
        this._cellules = vueTable.colonnes.map(colonne => new KfVueTableCelluleBilan<T>(vueTable, colonne, ligneDesVisibles));
    }

}
