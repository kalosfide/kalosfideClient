import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfGroupe } from './kf-groupe';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-kf-groupe',
    templateUrl: './kf-groupe.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfGroupeComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    type = KfTypeDeComposant;
    typeDeValeur = KfTypeDeValeur;

    constructor() {
        super();
    }

    get formGroup(): FormGroup {
        return (this.composant as KfGroupe).formGroup;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.domElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
