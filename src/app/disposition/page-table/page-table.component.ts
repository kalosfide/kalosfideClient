import { KfVueTable } from '../../commun/kf-composants/kf-vue-table/kf-vue-table';

import { PageBaseComponent } from '../page-base/page-base.component';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { Data, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { GroupeTable, IGroupeTableDef } from './groupe-table';
import { IPageTableDef } from './i-page-table-def';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

export abstract class PageTableComponent<T> extends PageBaseComponent implements OnInit, OnDestroy, AfterViewInit {

    liste: T[] = [];

    groupeTable: GroupeTable<T>;

    get vueTable(): KfVueTable<T> {
        return this.groupeTable.vueTable;
    }

    pageTableDef: IPageTableDef<T>;

    fragment: string;

    constructor(
        protected route: ActivatedRoute,
        protected _service: DataService
    ) {
        super();
    }

    /**
     * doit initialiser la liste
     * par défaut: data a un champ 'liste', fixe la liste de la vueTable
     * @param data Data à fournir par le resolver
     */
    protected chargeData(data: Data) {
        this.liste = data.liste;
    }

    protected abstract créePageTableDef(): void;

    abstract créeGroupeTableDef(): IGroupeTableDef<T>;

    protected créeGroupe(superGroupe?: 'super'): KfGroupe {
        const groupeTableDef = this.créeGroupeTableDef();
        const groupe: KfGroupe | KfSuperGroupe = superGroupe ? new KfSuperGroupe(this.nom) : new KfGroupe(this.nom);
        if (groupeTableDef.vueTableDef.superGroupe) {
            groupe.créeGereValeur();
        }
        this.groupeTable = new GroupeTable<T>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        if (superGroupe) {
            const sg = groupe as KfSuperGroupe;
            sg.quandTousAjoutés();
            this.superGroupe = sg;
        }
        return groupe;
    }

    protected chargeGroupe() {
        this._chargeVueTable(this.liste);
    }

    protected _chargeVueTable(liste: T[]) {
        const attente = this._service.attenteService.commence('chargeVueTable');
        this.vueTable.initialise(liste);
        this._service.attenteService.finit(attente);
    }

    protected créePageTableDefBase(): IPageTableDef<T> {
        const def: IPageTableDef<T> = {
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeGroupe('super'),
            chargeGroupe: () => this.chargeGroupe(),
        };
        return def;
    }

    ngOnInit() {
        this.créePageTableDef();
        if (this.pageTableDef.avantChargeData) { this.pageTableDef.avantChargeData(); }

        this.subscriptions.push(
            this.route.data.subscribe((data: Data) => {
                this.pageTableDef.chargeData(data);
                this.créeTitrePage();
                if (this.pageTableDef.initialiseUtile) { this.pageTableDef.initialiseUtile(); }
                this.pageTableDef.créeSuperGroupe();
                this.pageTableDef.chargeGroupe();
                if (this.pageTableDef.aprèsChargeData) { this.pageTableDef.aprèsChargeData(); }

                if (this.vueTable.id) {
                    this.subscriptions.push(
                        this.route.fragment.subscribe(
                            fragment => {
                                this.fragment = fragment;
                                const choisie = this.vueTable.fixeChoisie(fragment);
                                if (choisie) {
                                    choisie.gèreCss.ajouteClasseTemp('bg-light', 3000);
                                }
                            }
                        )
                    );
                }
            })
        );
    }

    ngAfterViewInit() {
        try {
            document.querySelector('#' + this.fragment).scrollIntoView();
        } catch (e) { }
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

}
