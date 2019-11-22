import { EtatTable, EtatTableType } from './etat-table';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from '../fabrique/fabrique';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';

export interface IGroupeTableDef<T> {
    vueTableDef: IKfVueTableDef<T>;
    avantTable?: () => KfGroupe;
    apresTable?: () => KfGroupe;
    typeEtat?: EtatTableType;
}

export class GroupeTable<T> {
    avantTable: KfGroupe;
    etat: EtatTable;
    groupeOutils: KfGroupe;
    groupeTable: KfGroupe;
    vueTable: KfVueTable<T>;
    apresTable: KfGroupe;

    typeEtat: EtatTableType;

    ajouteA(groupe: KfGroupe) {
        if (this.avantTable) {
            groupe.ajoute(this.avantTable);
        }

        if (this.etat) {
            groupe.ajoute(this.etat.groupe);
        }

        groupe.ajoute(this.vueTable);

        if (this.apresTable) {
            groupe.ajoute(this.apresTable);
        }
    }

    private get composantsSaufEtat(): KfComposant[] {
        let composants: KfComposant[] = [];
        if (this.avantTable) {
            composants = composants.concat(this.avantTable);
        }
        composants = composants.concat([this.vueTable]);
        if (this.apresTable) {
            composants = composants.concat(this.apresTable);
        }
        return composants;
    }

    constructor(groupeTableDef: IGroupeTableDef<T>) {
        this.vueTable = Fabrique.vueTable.vueTable('', groupeTableDef.vueTableDef);
        if (groupeTableDef.avantTable) {
            this.avantTable = groupeTableDef.avantTable();
        }
        if (groupeTableDef.apresTable) {
            this.apresTable = groupeTableDef.apresTable();
        }
        if (groupeTableDef.typeEtat) {
            this.typeEtat = groupeTableDef.typeEtat;
            this.etat = new EtatTable();
            if (groupeTableDef.typeEtat === EtatTableType.remplaceTableSiVide) {
                const estVide: () => boolean = (() => {
                    return this.vueTable.estVide;
                }).bind(this);
                this.etat.groupe.visibilitéFnc = estVide;
                this.composantsSaufEtat.forEach(c => c.invisibilitéFnc = estVide);
            }
        }
        return this;
    }

}
