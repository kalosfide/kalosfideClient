import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { KfListeDeroulante } from './kf-liste-deroulante';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-liste-deroulante',
    templateUrl: './kf-liste-deroulante.component.html',
})
export class KfListeDeroulanteComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('selectElement') selectElementRef: ElementRef;
    @ViewChildren('optionElement') optionElements: QueryList<ElementRef>;

    constructor() {
        super();
    }
    ngOnInit() {
    }

    get test(): any {
        const test: any = {};
        console.log(test);
        return 'test';
    }

    get listeDeroulante(): KfListeDeroulante {
        return this.composant as KfListeDeroulante;
    }
    get selectElement(): HTMLSelectElement {
        return this.selectElementRef.nativeElement as HTMLSelectElement;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.selectElement;
        this.composant.gereHtml.enfantsDeVue = {
            selectElement: this.selectElement,
        };
        this.selectElement.multiple = this.listeDeroulante.multiple;
        this.initialiseHtml();
/*
        this.optionElements.forEach(
            ref => console.log(ref));
*/
    }

}
