import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfVueTable, KfVueCelluleDef, KfVueTableDef } from '../../commun/kf-composants/kf-vue-table/kf-vue-table';

import { PageBaseComponent } from '../page-base/page-base.component';
import { Trieur } from 'src/app/commun/outils/trieur';

export abstract class PageTableComponent<T> extends PageBaseComponent {

    liste: T[] = [];

    abstract vueTableDef: KfVueTableDef<T>;

    avantTable: () => KfComposant[];
    apresTable: KfComposant[];
    remplaceListeVide: KfComposant;
    titreRésultatErreur: string;
    titreRésultatVide: string;

    vueTable: KfVueTable<T>;

    constructor(
    ) {
        super();
    }

    prépareSuperGroupe() {
        if (this.avantTable) {
            this.avantTable().forEach(composant => this.superGroupe.ajoute(composant));
        }
        if (this.remplaceListeVide && this.liste.length === 0) {
            this.superGroupe.ajoute(this.remplaceListeVide);
        } else {
            if (this.vueTable.avecFiltres) {
                this.superGroupe.ajoute(this.vueTable.créeSuperGroupeDesFiltres());
            }
            this.superGroupe.ajoute(this.vueTable);
        }
        if (this.apresTable) {
            this.apresTable.forEach(composant => this.superGroupe.ajoute(composant));
        }
    }

}
