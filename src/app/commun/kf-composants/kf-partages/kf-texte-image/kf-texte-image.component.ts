import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfImageDef } from '../kf-image-def/kf-image-def';
import { KfTexteImage } from './kf-texte-image';

@Component({
    selector: 'app-kf-texte-image',
    templateUrl: './kf-texte-image.component.html',
})
export class KfTexteImageComponent implements AfterViewInit {
    @Input() texteImage: KfTexteImage;

    @ViewChild('spanTexte') spanTexte: ElementRef;
    @ViewChild('imgAvant') imgAvant: ElementRef;
    @ViewChild('imgApres') imgApres: ElementRef;

    constructor() { }

    ngAfterViewInit() {
        this.texteImage.enfantsDeVue = {};
        if (this.imgAvant) {
            this.texteImage.enfantsDeVue['imgAvant'] = this.imgAvant.nativeElement;
        }
        if (this.spanTexte) {
            this.texteImage.enfantsDeVue['spanTexte'] = this.spanTexte.nativeElement;
        }
        if (this.imgApres) {
            this.texteImage.enfantsDeVue['imgApres'] = this.imgApres.nativeElement;
        }
    }

}
