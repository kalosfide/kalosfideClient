import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-nav',
    templateUrl: './kf-nav.component.html',
})
export class KfNavComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement') domElementRef: ElementRef;

    typeDeComposant = KfTypeDeComposant;

    constructor() {
        super();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.domElementRef.nativeElement;
        this.initialiseHtml();
    }

}
