import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-b-btn-toolbar',
    templateUrl: './kf-b-btn-toolbar.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfBBtnToolbarComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    constructor() {
        super();
    }

    get ariaLabel(): string {
        return this.composant.nom;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.domElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
