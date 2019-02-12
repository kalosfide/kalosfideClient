import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfBalise } from './kf-balise';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfTypeDeBaliseHTML } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-balise',
    templateUrl: './kf-balise.component.html',
})
export class KfBaliseComponent implements OnInit, AfterViewInit {
    @Input() balise: KfBalise;
    @ViewChild('baliseElement') baliseElement: ElementRef;

    // pour le switch
    typeDeBalise = KfTypeDeBaliseHTML;

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (this.baliseElement) {
            this.balise.afterViewInit(this.baliseElement.nativeElement);
        }
    }

}
