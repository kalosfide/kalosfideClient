import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { KfRadios } from './kf-radios';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfRadio } from './kf-radio';

@Component({
    selector: 'app-kf-radio',
    templateUrl: './kf-radio.component.html',
})
export class KfRadioComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement') inputElement: ElementRef;
    @ViewChild('labelElement') labelElement: ElementRef;

    constructor() {
        super();
    }

    get radio(): KfRadio {
        return this.composant as KfRadio;
    }

    get radios(): KfRadios {
        return this.radio.radios;
    }

    get classe(): string {
        return 'form-check-input'
            + (!this.composant.texteImage ? 'position-static' : '')
            + this.composant.classe;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.inputElement.nativeElement,
        this.composant.gereHtml.enfantsDeVue = {
            inputElement: this.inputElement.nativeElement,
            labelElement: this.labelElement.nativeElement,
        };
        this.initialiseHtml();
/*
        let i = 0;
        (this.composant as KfRadios).enfants.forEach(
            radio => {
                const r = (radio as KfRadio)
                r.enfantsDeVue = {
                   this.composant.htmlElement = r.inputElement.nativeElement),
                    inputElement: r.inputElement.nativeElement),
                    labelElement: r.labelElement.nativeElement),
                };
                i++;
            }
        );
*/
    }

}
