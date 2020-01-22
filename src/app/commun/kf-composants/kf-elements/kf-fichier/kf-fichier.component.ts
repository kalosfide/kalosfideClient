import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfFichier } from './kf-fichier';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfTypeDEvenement, KfStatutDEvenement, KfEvenement } from '../../kf-partages/kf-evenements';

@Component({
    selector: 'app-kf-fichier',
    template: `
    <label #labelElement [attr.for]="composant.nom" [ngClass]="composant.classe" [ngStyle]="composant.style">
        <app-kf-contenu-phrase *ngIf="composant.contenuPhrase"  [contenuPhrase]="composant.contenuPhrase"></app-kf-contenu-phrase>
        <input
            #inputElement
            [id]="composant.nom"
            type="file"
            [attr.accept]="composant.typesAcceptes"
            [attr.multiple]="composant.multiple ? '' : undefined"
            (change)="quandChange()"
            [style.display]="composant.inputVisible ? 'inline-block' : 'none'"
        />
    </label>
    <!--
    -->
`,
    styleUrls: ['../../kf-composants.scss']
})
export class KfFichierComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement', {static: false}) inputElement: ElementRef;
    @ViewChild('labelElement', {static: false}) labelElement: ElementRef;

    test: any;

    file: File;

    constructor() { super(); }

    ngOnInit() {
        this.test = this.fichier.formControl === undefined;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.labelElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            inputElement: this.inputElement.nativeElement,
            labelElement: this.labelElement.nativeElement,
        };
        this.composant.gereHtml.initialiseHtml(this.output);
        const inputElement = this.inputElement.nativeElement as HTMLInputElement;
    }

    get fichier(): KfFichier { return this.composant as KfFichier; }

    quandChange() {
        const files: FileList = (this.inputElement.nativeElement as HTMLInputElement).files;
        this.fichier.files = [];
        for (let i = 0; i < files.length; i++) {
            this.fichier.files.push(files[i]);
        }
        const evenement = new KfEvenement(this.composant, KfTypeDEvenement.fichiersChoisis, files);
        this.output.emit(evenement);
    }

}
