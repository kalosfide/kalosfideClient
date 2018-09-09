import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfBouton } from './kf-bouton';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { FormGroup } from '@angular/forms';
import { KfTexteImage } from '../../kf-partages/kf-texte-image';
import { KfTypeDeBouton } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-bouton',
    templateUrl: './kf-bouton.component.html',
})
export class KfBoutonComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement') htmlElementRef: ElementRef;

    constructor() {
        super();
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.htmlElementRef.nativeElement;
        this.initialiseHtml();
    }

    get button(): HTMLButtonElement {
        return this.htmlElementRef.nativeElement;
    }

    get bouton(): KfBouton {
        return this.composant as KfBouton;
    }

    get form(): FormGroup {
        return (this.composant.formulaireParent)
            ? this.composant.formulaireParent.formGroup
            : null;
    }

    get buttonType(): string {
        return 'button';
    }
    get nomBouton(): string {
        return this.bouton.nom;
    }
    get inactif(): boolean {
        switch (this.bouton.typeDeBouton) {
            case KfTypeDeBouton.bouton:
                return this.bouton.inactif;
            case KfTypeDeBouton.annuler:
                return false;
            case KfTypeDeBouton.retablir:
                return (this.form) ? this.form.pristine : false;
            case KfTypeDeBouton.soumettre:
                const inactif = (this.form) ? this.form.pristine || !this.form.valid
 //                   || (this.bouton.patience && this.bouton.patience.enCours)
                     : false;
                return inactif;
            default:
                break;
        }
    }

    get texteImage(): KfTexteImage {
        return this.bouton.texteImage;
    }

}
