import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfLien } from './kf-lien';

@Component({
    selector: 'app-kf-lien',
    templateUrl: 'kf-lien.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfLienComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('baliseElement', {static: false}) baliseElementRef: ElementRef;

    constructor(
            ) {
        super();
    }

    get lien(): KfLien {
        return this.composant as KfLien;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.baliseElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
