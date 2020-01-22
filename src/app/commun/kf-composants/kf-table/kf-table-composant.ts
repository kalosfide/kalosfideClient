import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

export interface IKfTableCellule {
    enTête?: boolean;
    texte?: string;
    composant?: KfComposant;
    géreCss?: KfGéreCss;
}
export interface IKfTableLigne {
    cellules: IKfTableCellule[];
    géreCss?: KfGéreCss;
}
export class KfTable extends KfComposant {
    enTête: IKfTableLigne;
    corps: IKfTableLigne[];
    private _gereCssEnTete: KfGéreCss;
    private _gereCssCorps: KfGéreCss;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.table);
    }

    get gereCssEnTete(): KfGéreCss {
        if (!this._gereCssEnTete) {
            this._gereCssEnTete = new KfGéreCss();
        }
        return this._gereCssEnTete;
    }

    get classeEnTete(): KfNgClasse {
        if (this._gereCssEnTete) {
            return this._gereCssEnTete.classe;
        }
    }

    get styleEnTete(): KfNgStyle {
        if (this._gereCssEnTete) {
            return this._gereCssEnTete.style;
        }
    }

    get gereCssCorps(): KfGéreCss {
        if (!this._gereCssCorps) {
            this._gereCssCorps = new KfGéreCss();
        }
        return this._gereCssCorps;
    }

    get classeCorps(): KfNgClasse {
        if (this._gereCssCorps) {
            return this._gereCssCorps.classe;
        }
    }

    get styleCorps(): KfNgStyle {
        if (this._gereCssCorps) {
            return this._gereCssCorps.style;
        }
    }

    classeLigne(ligne: IKfTableLigne): KfNgClasse {
        if (ligne.géreCss) {
            return ligne.géreCss.classe;
        }
    }

    styleLigne(ligne: IKfTableLigne): KfNgStyle {
        if (ligne.géreCss) {
            return ligne.géreCss.style;
        }
    }

    classeCellule(cellule: IKfTableCellule): KfNgClasse {
        if (cellule.géreCss) {
            return cellule.géreCss.classe;
        }
    }

    styleCellule(cellule: IKfTableCellule): KfNgStyle {
        if (cellule.géreCss) {
            return cellule.géreCss.style;
        }
    }

    th_scope(cellule: IKfTableCellule, ligne: IKfTableLigne): string {
        return ligne === this.enTête ? 'col' : cellule.enTête ? 'row' : undefined;
    }

}
