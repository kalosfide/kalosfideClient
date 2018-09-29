import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { KfRadios } from './kf-radios';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfRadio } from './kf-radio';

@Component({
    selector: 'app-kf-radios',
    templateUrl: './kf-radios.component.html',
})
export class KfRadiosComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('divElement') divElement: ElementRef;

    get radios(): KfRadios {
        return this.composant as KfRadios;
    }

    constructor() {
        super();
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.divElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            divElement: this.divElement.nativeElement,
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
