import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-texte',
    templateUrl: './kf-texte.component.html',
})
export class KfTexteComponent extends KfComposantComponent implements OnInit, AfterViewInit {
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

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.inputElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            inputElement: this.inputElement.nativeElement,
            labelElement: this.labelElement.nativeElement,
        };
        this.initialiseHtml();
    }

}
