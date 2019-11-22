import { KfComposant } from '../kf-composant/kf-composant';
import { Tri } from '../../outils/trieur';
import { KfVueTableCelluleDef } from './kf-vue-table-cellule';
import { KfVueTable } from './kf-vue-table';
import { KfNgClasseDef, KfNgClasse, KfNgClasseDefDe } from '../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { KfGèreCssDe } from '../kf-partages/kf-gere-css-de-t';
import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { IKfVueTableBilanDef } from './i-kf-vue-table-bilan-def';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';

export class KfVueTableColonne<T> {

    private _vueTable: KfVueTable<T>;
    private _index: number;
    private _colonneDef: IKfVueTableColonneDef<T>;
    private _gereCssEntete: KfGèreCss;
    private _gereCssItem: KfGèreCssDe<T>;
    private _gereCssBilan: KfGèreCss;

    nePasAfficher: boolean;

    constructor(vueTable: KfVueTable<T>, colonneDef: IKfVueTableColonneDef<T>, index: number) {
        this._vueTable = vueTable;
        this._colonneDef = colonneDef;
        this._index = index;
        if (colonneDef.nePasAfficherSi) {
            this.nePasAfficher = colonneDef.nePasAfficherSi.valeur;
        } else {
            if (colonneDef.afficherSi) {
                this.nePasAfficher = !colonneDef.afficherSi.valeur;
            }
        }
        if (colonneDef.classeDefs) {
            this.ajouteClasseItemArray(colonneDef.classeDefs);
        }
    }

    get vueTable(): KfVueTable<T> { return this._vueTable; }

    get index(): number { return this._index; }

    get nom(): string { return this._colonneDef.nom; }

    /**
     * texte ou composant à afficher dans la ligne d'en-tête
     */
    get enTeteDef(): IKfVueTableEnTeteDef { return this._colonneDef.enTeteDef; }

    /**
     * tri associè à la colonne
     */
    get tri(): Tri<T> { return this._colonneDef.tri; }

    /**
     * texte ou composant à afficher dans l'élément td associèe à l'item
     */
    get créeContenu(): (item: T) => KfVueTableCelluleDef { return this._colonneDef.créeContenu; }

    /**
     * classe à appliquer à l'élément td associèe à l'item
     */
    get classes(): (string | ((t: T) => string) | KfNgClasseDefDe<T>)[] { return this._colonneDef.classeDefs; }

    /**
     * texte ou composant à afficher dans la ligne de bilan
     */
    get bilanDef(): IKfVueTableBilanDef<T> { return this._colonneDef.bilanDef; }

    /**
     * classe à ajouter à l'élément th de l'en-tête
     */
    ajouteClasseEntete(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this._gereCssEntete) {
            this._gereCssEntete = new KfGèreCss();
        }
        this._gereCssEntete.ajouteClasseDefArray(classeDefs);
    }

    get classeEntete(): KfNgClasse {
        if (this._gereCssEntete) {
            return this._gereCssEntete.classe;
        }
    }

    /**
     * classe à ajouter à l'élément td de l'item
     */
    ajouteClasseItemArray(classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        if (!this._gereCssItem) {
            this._gereCssItem = new KfGèreCssDe<T>();
        }
        this._gereCssItem.ajouteClasseDefArray(classeDefs);
    }
    ajouteClasseItem(...classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        this.ajouteClasseItemArray(classeDefs);
    }

    classeItem(t: T): KfNgClasse {
        if (this._gereCssItem) {
            return this._gereCssItem.classe(t);
        }
    }

    /**
     * classe à ajouter à l'élément th du bilan
     */
    ajouteClasseBilan(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this._gereCssBilan) {
            this._gereCssBilan = new KfGèreCss();
        }
        this._gereCssBilan.ajouteClasseDefArray(classeDefs);
    }

    get classeBilan(): KfNgClasse {
        if (this._gereCssBilan) {
            return this._gereCssBilan.classe;
        }
    }
}
