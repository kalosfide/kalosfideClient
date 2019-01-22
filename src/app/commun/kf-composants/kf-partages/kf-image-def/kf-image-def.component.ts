import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfImageDef } from './kf-image-def';
import { ValeurTexteDef } from '../kf-texte-def';
import { ValeurNombreDef } from '../kf-nombre-def';

@Component({
    selector: 'app-kf-image-def',
    templateUrl: './kf-image-def.component.html',
})
export class KfImageDefComponent {
    @Input() imageDef: KfImageDef;

    get classe(): string {
        return this.imageDef.classe;
    }

    get url(): string {
        return ValeurTexteDef(this.imageDef.urlDef);
    }

    get avecLargeur(): boolean {
        return !!this.imageDef.largeurDef;
    }

    get largeur(): number {
        return ValeurNombreDef(this.imageDef.largeurDef);
    }

    get avecHauteur(): boolean {
        return !!this.imageDef.hauteurDef;
    }

    get hauteur(): number {
        return ValeurNombreDef(this.imageDef.hauteurDef);
    }
}
