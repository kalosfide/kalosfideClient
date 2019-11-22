import { KfVueTable } from './kf-vue-table';
import { KfVueTableCelluleBase, IKfVueTableCellule, IKfVueTableCelluleDef, KfVueTableCelluleDef } from './kf-vue-table-cellule';
import { KfVueTableColonne } from './kf-vue-table-colonne';
import { KfIcone } from '../kf-elements/kf-icone/kf-icone';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { Tri } from '../../outils/trieur';
import { FANomIcone } from '../kf-partages/kf-icone-def';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';
import { KfVueTableLigneBase, IKfVueTableLigne } from './kf-vue-table-ligne';

export class KfVueTableCelluleEnTete<T> extends KfVueTableCelluleBase<T> implements IKfVueTableCellule {

    constructor(vueTable: KfVueTable<T>, colonne: KfVueTableColonne<T>, ligneSousChapeau?: boolean) {
        super(vueTable, colonne, colonne.index);
        this.th_scope = 'col';
    }

    créeContenu(def: KfVueTableCelluleDef, tri?: Tri<T>) {
        this._composant = this.créeComposant(def);
        this.composant.ajouteClasseDef('kf-vue-table-en-tete');
        if (tri) {
            const i = new KfIcone('i' + (this._index + 1), this.nomIcone(tri));
            i.ajouteClasseDef('kf-vue-table-tri');
            this.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
                (evenement: KfEvenement) => {
                    if (evenement.emetteur === i) {
                        i.nomIcone = this.nomIcone(tri);
                        this._vueTable.trie(tri);
                        evenement.statut = KfStatutDEvenement.fini;
                    }
                });
            this.composant.contenuPhrase.ajoute(i);
        }
    }

    private nomIcone(tri: Tri<T>): FANomIcone {
        if (tri) {
            if (tri.desc === true) {
                return 'sort-asc';
            }
            return 'sort-desc';
        }
    }

    /**
     * classe à ajouter à l'élément th de l'en-tête
     */
    get classe(): KfNgClasse {
        return this._colonne.classeEntete;
    }
}

export class KfVueTableLigneEnTete<T> extends KfVueTableLigneBase<T> implements IKfVueTableLigne {


    constructor(vueTable: KfVueTable<T>) {
        super(vueTable);
        this._cellules = [];
    }

    ajoute(cellule: KfVueTableCelluleEnTete<T>) {
        this._cellules.push(cellule);
    }

}

export class KfVueTableEnTete<T> {
    lignes: KfVueTableLigneEnTete<T>[];

    constructor(vueTable: KfVueTable<T>) {
        const colonnes = vueTable.colonnes;
        const ligne = new KfVueTableLigneEnTete<T>(vueTable);
        let ligneSousChapeau: KfVueTableLigneEnTete<T>;
        if (colonnes.find(c => c.enTeteDef !== undefined && c.enTeteDef.chapeauDef !== undefined) !== undefined) {
            ligneSousChapeau = new KfVueTableLigneEnTete<T>(vueTable);
        }
        let index = 0;
        let def: IKfVueTableEnTeteDef;
        let dernierDuGroupe = -1;
        let cellule: KfVueTableCelluleEnTete<T>;
        const nb = colonnes.length;
        while (index < nb) {
            def = colonnes[index].enTeteDef;
            cellule = new KfVueTableCelluleEnTete<T>(vueTable, vueTable.colonnes[index]);
            if (def && def.chapeauDef && def.longueurChapeau > 1) {
                cellule.créeContenu(def.chapeauDef);
                cellule.colSpan = def.longueurChapeau;
                ligne.ajoute(cellule);
                cellule = new KfVueTableCelluleEnTete<T>(vueTable, vueTable.colonnes[index]);
                cellule.créeContenu(def.titreDef, colonnes[index].tri);
                ligneSousChapeau.ajoute(cellule);
                dernierDuGroupe = index + def.longueurChapeau - 1;
            } else {
                cellule.créeContenu(def ? def.titreDef : '', colonnes[index].tri);
                if (ligneSousChapeau) {
                    if (index <= dernierDuGroupe) {
                        ligneSousChapeau.ajoute(cellule);
                    } else {
                        cellule.rowSpan = 2;
                        ligne.ajoute(cellule);
                    }
                } else {
                    ligne.ajoute(cellule);
                }
            }
            index++;
        }
        if (ligneSousChapeau) {
            this.lignes = [ligne, ligneSousChapeau];
        } else {
            this.lignes = [ligne];
        }
    }

}
