import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfEtiquette } from './kf-etiquette';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfTypeDeBaliseDEtiquette } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-etiquette',
    templateUrl: './kf-etiquette.component.html',
})
export class KfEtiquetteComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('baliseElement') baliseElement: ElementRef;

    typeDeBalise = KfTypeDeBaliseDEtiquette;

    constructor() {
        super();
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.baliseElement.nativeElement;
        this.initialiseHtml();
    }

}
