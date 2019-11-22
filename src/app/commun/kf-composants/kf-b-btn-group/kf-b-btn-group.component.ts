import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-b-btn-group',
    templateUrl: './kf-b-btn-group.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfBBtnGroupComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement') domElementRef: ElementRef;

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
