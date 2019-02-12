import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfBouton } from './kf-bouton';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { FormGroup } from '@angular/forms';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
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

    get buttonType(): string {
        return 'button';
    }
    get nomBouton(): string {
        return this.bouton.nom;
    }
    get inactif(): boolean {
        const form = this.composant.formulaireParent;
        switch (this.bouton.typeDeBouton) {
            case KfTypeDeBouton.bouton:
                return this.bouton.inactif;
            case KfTypeDeBouton.annuler:
                return false;
            case KfTypeDeBouton.retablir:
                return form ? form.formGroup.pristine : false;
            case KfTypeDeBouton.soumettre:
                const inactif = form ? (form.neSoumetPasSiPristine && form.formGroup.pristine) || !form.formGroup.valid
 //                   || (this.bouton.patience && this.bouton.patience.enCours)
                     : false;
                return inactif;
            default:
                break;
        }
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.bouton.contenuPhrase;
    }

}
