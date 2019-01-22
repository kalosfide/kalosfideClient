import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfCaseACocher } from './kf-case-a-cocher';

@Component({
    selector: 'app-kf-caseacocher',
    templateUrl: './kf-case-a-cocher.component.html',
})
export class KfCaseACocherComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement') inputElement: ElementRef;
    @ViewChild('labelElement') labelElement: ElementRef;

    constructor() {
        super();
    }
    ngOnInit() {
    }

    get ngClass(): {[keys: string]: boolean} {
        return {
            'form-check-input': true,
            'position-static': ! this.composant.texteImage,
            'is-invalid': this.composant.erreurs.length > 0
        };
    }
    get case(): KfCaseACocher {
        return this.composant as KfCaseACocher;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.inputElement.nativeElement,
        this.composant.gereHtml.enfantsDeVue = {
            inputElement: this.inputElement.nativeElement,
        };
        if (this.case.texteImageAvant || this.case.texteImageApres) {
            this.composant.gereHtml.enfantsDeVue['labelElement'] = this.labelElement.nativeElement;
        }
        this.initialiseHtml();
    }

}
