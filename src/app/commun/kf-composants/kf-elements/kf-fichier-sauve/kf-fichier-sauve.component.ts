import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { KfFichierSauve } from './kf-fichier-sauve';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement } from '../../kf-partages/kf-evenements';

@Component({
    selector: 'app-kf-fichier-sauve',
    template: `
        <a #baliseElement [download]="composant.nomFichier" [href]="dataUrl" [ngClass]="composant.classe"
            [ngStyle]="composant.style"> (click)="quandClic()">
            <app-kf-contenu-phrase  [contenuPhrase]="composant.contenuPhrase"></app-kf-contenu-phrase>
        </a>
`,
    styleUrls: ['../../kf-composants.scss']
})
export class KfFichierSauveComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('baliseElement') baliseElementRef: ElementRef;

    constructor(private sanitizer: DomSanitizer) {
        super();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.baliseElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

    get dataUrl(): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl((this.composant as KfFichierSauve).dataUrl);
    }

    quandClic() {
        const evenement = new KfEvenement(this.composant, KfTypeDEvenement.fichierSauve);
        this.traiteOuTransmet(evenement);
    }

}
