import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfVueTable, KfVueTableCellule } from './kf-vue-table';

@Component({
    selector: 'app-kf-vue-table',
    templateUrl: './kf-vue-table.component.html',
})
export class KfVueTableComponent extends KfComposantComponent implements AfterViewInit {
    @ViewChild('tableElement') tableElement: ElementRef;

    constructor() {
        super();
    }

    get vueTable(): KfVueTable {
        return this.composant as KfVueTable;
    }

    get colonnes(): string[] {
        return this.vueTable.colonnes;
    }

    get lignes(): (KfVueTableCellule[])[] {
        return this.vueTable.lignesDeCellules;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.tableElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            tableElement: this.tableElement.nativeElement,
        };
        this.initialiseHtml();
    }

}
