import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfCaseACocher } from './kf-case-a-cocher';

@Component({
    selector: 'app-kf-caseacocher',
    templateUrl: './kf-case-a-cocher.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfCaseACocherComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement') inputElement: ElementRef;
    @ViewChild('labelElement') labelElement: ElementRef;

    constructor() {
        super();
    }
    ngOnInit() {
    }

    get case(): KfCaseACocher {
        return this.composant as KfCaseACocher;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.inputElement.nativeElement,
        this.composant.gereHtml.enfantsDeVue = {
            inputElement: this.inputElement.nativeElement,
        };
        if (this.case.avecLabelAvant || this.case.avecLabelApres) {
            this.composant.gereHtml.enfantsDeVue['labelElement'] = this.labelElement.nativeElement;
        }
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
