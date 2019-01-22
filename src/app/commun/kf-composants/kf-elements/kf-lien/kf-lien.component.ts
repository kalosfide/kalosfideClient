import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfLien } from './kf-lien';

@Component({
    selector: 'app-kf-lien',
    templateUrl: 'kf-lien.component.html'
})
export class KfLienComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('baliseElement') baliseElementRef: ElementRef;

    constructor(
            ) {
        super();
    }

    get classe(): string {
        const classe = this.composant.classe;
        return this.composant.inactif ? classe + ' disabled' : classe;
    }

    get lien(): KfLien {
        return this.composant as KfLien;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.baliseElementRef.nativeElement;
        this.initialiseHtml();
    }

}
