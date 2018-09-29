import { OnInit } from '@angular/core';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfVueTable } from '../../commun/kf-composants/kf-elements/kf-vue-table/kf-vue-table';

import { DataService } from '../../services/data.service';
import { Title } from '@angular/platform-browser';
import { TitreHtmlService } from '../../services/titreHtml.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';

import { PageBaseComponent } from '../page-base/page-base.component';

export abstract class DataIndexComponent<T> extends PageBaseComponent implements OnInit {

    liste: T[] = [];

    abstract colonnes: string[];
    abstract cellules: (ligne: T) => (string | KfComposant[])[];
    abstract choisie: (ligne: T) => boolean;

    avantTable: KfComposant[];
    apresTable: KfComposant[];
    titreRésultatErreur: string;
    titreRésultatVide: string;

    superGroupe: KfSuperGroupe;

    vueTable: KfVueTable;

    constructor(
        protected service: DataService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(titleService, titreHtmlService, attenteAsyncService);
    }

    ngOnInit() {
        this.ngOnInit_TitreHtml();
        this.ngOnInit_Charge();
        this.vueTable = new KfVueTable(this.nom + '_table', this.colonnes, this.cellules, this.choisie);
        this.vueTable.fixeLignes(this.liste);

        this.superGroupe = new KfSuperGroupe(this.nom);
        if (this.avantTable) {
            this.avantTable.forEach(composant => this.superGroupe.ajoute(composant));
        }
        this.superGroupe.ajoute(this.vueTable);
        if (this.apresTable) {
            this.apresTable.forEach(composant => this.superGroupe.ajoute(composant));
        }
        this.superGroupe.quandTousAjoutés();
    }

}
