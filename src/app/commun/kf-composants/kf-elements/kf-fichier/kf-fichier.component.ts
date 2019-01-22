import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfFichier } from './kf-fichier';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfTypeDEvenement, KfStatutDEvenement, KfEvenement } from '../../kf-partages/kf-evenements';

@Component({
    selector: 'app-kf-fichier',
    template: `
    <label #labelElement [attr.for]="composant.nom" [ngClass]="composant.classe">
        <app-kf-texte-image *ngIf="composant.texteImage"  [texteImage]="composant.texteImage"></app-kf-texte-image>
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
`
})
export class KfFichierComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement') inputElement: ElementRef;
    @ViewChild('labelElement') labelElement: ElementRef;

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
        this.initialiseHtml();
        const inputElement = this.inputElement.nativeElement as HTMLInputElement;
    }

    get fichier(): KfFichier { return this.composant as KfFichier; }

    quandChange() {
        const files: FileList = (this.inputElement.nativeElement as HTMLInputElement).files;
        this.fichier.files = [];
        for (let i = 0; i < files.length; i++) {
            this.fichier.files.push(files[i]);
        }
        const evenement: KfEvenement = {
            emetteur: this.composant,
            type: KfTypeDEvenement.fichiersChoisis,
            parametres: files,
            statut: KfStatutDEvenement.aTraiter
        };
        this.output.emit(evenement);
    }

}
