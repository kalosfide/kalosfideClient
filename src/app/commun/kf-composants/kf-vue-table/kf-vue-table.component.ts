import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { IKfVueTable, IKfVueTableLigne } from './kf-vue-table';

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

    get lignes(): IKfVueTableLigne[] {
        return this.vueTable.lignes;
    }

    ngAfterViewInit() {
        console.log(this.composant);
        console.log(this.vueTable);
        this.composant.gereHtml.htmlElement = this.tableElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            tableElement: this.tableElement.nativeElement,
        };
        this.initialiseHtml();
    }

}
