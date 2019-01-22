import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { IKfVueTable, IKfVueTableEnTete, IKfVueTableLigne } from './kf-vue-table';

@Component({
    selector: 'app-kf-vue-table',
    templateUrl: './kf-vue-table.component.html',
})
export class KfVueTableComponent extends KfComposantComponent implements AfterViewInit {
    @ViewChild('tableElement') tableElement: ElementRef;

    constructor() {
        super();
    }

    get vueTable(): IKfVueTable {
        return (this.composant as any) as IKfVueTable;
    }

    get enTetes(): IKfVueTableEnTete[] {
        return this.vueTable.enTetes;
    }

    icone(enTete: IKfVueTableEnTete): string {
        if (enTete.tri) {
            if (enTete.tri.desc === undefined) {
                return 'sort';
            }
            if (enTete.tri.desc) {
                return 'sort-down';
            }
            return 'sort-up';
        }
    }

    get lignes(): IKfVueTableLigne[] {
        return this.vueTable.lignes;
    }

    trie(enTete: IKfVueTableEnTete) {
        console.log(enTete.tri);
        this.vueTable.trie(enTete);
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
