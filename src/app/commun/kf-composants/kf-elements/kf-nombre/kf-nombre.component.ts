import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfNombre } from './kf-nombre';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-nombre',
    templateUrl: './kf-nombre.component.html',
})
/*
        <app-kf-affiche-erreur [composant]="composant"></app-kf-affiche-erreur >
*/
export class KfNombreComponent extends KfComposantComponent implements OnInit , AfterViewInit {
    @ViewChild('inputElement') inputElement: ElementRef;
    @ViewChild('labelElement') labelElement: ElementRef;

    get nombre(): KfNombre { return this.composant as KfNombre; }

    constructor() {
        super();
    }
    ngOnInit() {
    }

    get classe(): string {
        return 'form-control' + (this.composant.erreurs.length > 0 ? ' is-invalid' : '') + this.composant.classe;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.inputElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            inputElement: this.inputElement.nativeElement,
            labelElement: this.labelElement.nativeElement,
        };
        this.initialiseHtml();
    }

}
