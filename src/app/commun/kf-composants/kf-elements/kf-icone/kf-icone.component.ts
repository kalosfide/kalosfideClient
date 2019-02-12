import { Component, ViewChild, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfIcone } from './kf-icone';

@Component({
    selector: 'app-kf-icone',
    templateUrl: './kf-icone.component.html',
})
export class KfIconeComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement') htmlElement: ElementRef;

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (this.htmlElement) {
            this.composant.gereHtml.htmlElement = this.htmlElement.nativeElement;
            this.initialiseHtml();
        }
    }
    clic() {
        console.log('clic');
    }
    get item() {
        const icone = this.composant as KfIcone;
        if (icone.couches) {
            return icone.couches[0];
        }
    }
}
