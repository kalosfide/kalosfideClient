import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfInput, KfTypeDInput } from './kf-input';
import { KfNombre } from './kf-nombre';

@Component({
    selector: 'app-kf-input',
    templateUrl: './kf-input.component.html',
})
export class KfInputComponent extends KfComposantComponent implements OnInit , AfterViewInit {
    @ViewChild('inputElement') inputElement: ElementRef;
    @ViewChild('labelElement') labelElement: ElementRef;

    constructor() {
        super();
    }
    ngOnInit() {
    }

    get classe(): string {
        return 'form-control' + (this.composant.erreurs.length > 0 ? ' is-invalid' : '') + this.composant.classe;
    }

    get input(): KfInput {
        return this.composant as KfInput;
    }

    get nombre(): KfNombre {
        if (this.input.typeDInput === KfTypeDInput.nombre) {
            return this.composant as KfNombre;
        }
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.inputElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = this.labelElement
            ? {
            inputElement: this.inputElement.nativeElement,
            labelElement: this.labelElement.nativeElement,
            } : {
            inputElement: this.inputElement.nativeElement,
            };
        this.initialiseHtml();
    }

}
