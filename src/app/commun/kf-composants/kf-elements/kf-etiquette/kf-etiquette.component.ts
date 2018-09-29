import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfEtiquette } from './kf-etiquette';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfTypeDeBaliseDEtiquette } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-etiquette',
    template: `
    <ng-container [ngSwitch]="composant.baliseHTML">

        <ng-container *ngSwitchCase="typeDeBalise.aucun">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </ng-container>

        <div *ngSwitchCase="typeDeBalise.div" #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </div>

        <span *ngSwitchCase="typeDeBalise.span" #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </span>

        <P *ngSwitchCase="typeDeBalise.P" #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </P>

        <h1 *ngSwitchCase="typeDeBalise.h1" #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </h1>

        <h2 *ngSwitchCase="typeDeBalise.h2" #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </h2>

        <h3 *ngSwitchCase="typeDeBalise.h3" #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </h3>

        <h4 *ngSwitchCase="typeDeBalise.h4" #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </h4>

        <h5 *ngSwitchCase="typeDeBalise.h5" #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </h5>

        <h6 *ngSwitchCase="typeDeBalise.h6" #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </h6>

    </ng-container>
`,
})
export class KfEtiquetteComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('baliseElement') baliseElement: ElementRef;

    typeDeBalise = KfTypeDeBaliseDEtiquette;

    constructor() {
        super();
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.baliseElement.nativeElement;
        this.initialiseHtml();
    }

}
