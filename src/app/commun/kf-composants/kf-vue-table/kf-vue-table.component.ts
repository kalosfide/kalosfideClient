import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { IKfVueTable } from './kf-vue-table';
import { IKfVueTableLigne } from './kf-vue-table-ligne';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { IKfVueTableOutilVue } from './kf-vue-table-outil';

@Component({
    selector: 'app-kf-vue-table',
    templateUrl: './kf-vue-table.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfVueTableComponent extends KfComposantComponent implements AfterViewInit {
    @ViewChild('tableElement') tableElement: ElementRef;

    constructor() {
        super();
    }

    get vueTable(): IKfVueTable {
        return (this.composant as any) as IKfVueTable;
    }

    get avecOutils(): boolean {
        return !!this.vueTable.outils && !this.vueTable.outils.nePasAfficher;
    }

    get classeFiltres(): KfNgClasse {
        if (this.vueTable.outils) {
            return this.vueTable.outils.classe;
        }
    }

    get ifiltres(): IKfVueTableOutilVue[] {
        return this.vueTable.outils.outils;
    }

    get lignes(): IKfVueTableLigne[] {
        return this.vueTable.ilignes;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.tableElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            tableElement: this.tableElement.nativeElement,
        };
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
