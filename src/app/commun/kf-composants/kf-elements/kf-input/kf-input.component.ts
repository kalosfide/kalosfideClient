import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfInput, KfTypeDInput } from './kf-input';
import { KfInputNombre } from './kf-input-nombre';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfInputDateTemps } from './kf-input-date-temps';
import { KfComposant } from '../../kf-composant/kf-composant';

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

    classe(composant: KfComposant): string {
        return 'form-control' + (composant.erreurs.length > 0 ? ' is-invalid' : '') + composant.classe;
    }

    get input(): KfInput {
        return this.composant as KfInput;
    }

    get nombre(): KfInputNombre {
        if (this.input.typeDInput === KfTypeDInput.nombre) {
            return this.composant as KfInputNombre;
        }
    }
    get dateTemps(): KfInputDateTemps {
        if (this.input.typeDInput === KfTypeDInput.datetemps) {
            return this.composant as KfInputDateTemps;
        }
    }

    get contenuPhrase(): KfContenuPhrase {
        if (this.input.contenuPhrase.contenus.length > 0) {
            return this.input.contenuPhrase;
        }
    }

    ngAfterViewInit() {
        if (this.inputElement) {
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

}
