import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfParametres } from '../kf-composants-parametres';
import { isFunction } from 'util';

export class KfTexteImage {

    /**
     * texte de l'element ou de son label (facultatif)
     */
    private _texte: string | (() => string);
    /**
     * image avant le texte de l'element ou de son label (facultatif)
     */
    private _imageAvant: string | (() => string);
    /**
     * image avant le texte de l'element ou de son label (facultatif)
     */
    private _imageApres: string | (() => string);

    enfantsDeVue: { [key: string]: HTMLElement };

    constructor(
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        this._texte = texte;
        this._imageAvant = imageAvant;
        this._imageApres = imageApres;
    }

    /**
     * retourne le texte de l'element ou de son label (facultatif)
     */
    get texte(): string {
        if (this._texte) {
            if (typeof(this._texte) === 'string') {
                return this._texte;
            } else {
                return this._texte();
            }
        }
    }
    /**
     * fixe le texte de l'element ou de son label (facultatif)
     */
    fixeTexte(texte: string | (() => string)) {
        this._texte = texte;
    }
    /**
     * retourne l'image avant le texte de l'element ou de son label (facultatif)
     */
    get imageAvant(): string {
        if (this._imageAvant) {
            if (typeof(this._imageAvant) === 'string') {
                return this._imageAvant;
            } else {
                return this._imageAvant();
            }
        }
    }
    /**
     * fixe l'image avant le texte de l'element ou de son label (facultatif)
     */
    fixeImageAvant(imageAvant: string | (() => string)) {
        this._imageAvant = imageAvant;
    }
    /**
     * retourne l'image après le texte de l'element ou de son label (facultatif)
     */
    get imageApres(): string {
        if (this._imageApres) {
            if (typeof(this._imageApres) === 'string') {
                return this._imageApres;
            } else {
                return this._imageApres();
            }
        }
    }
    /**
     * fixe l'image après le texte de l'element ou de son label (facultatif)
     */
    fixeImageApres(imageApres: string | (() => string)) {
        this._imageApres = imageApres;
    }

}

@Component({
    selector: 'app-kf-texte-image',
    template: `
    <img #imgAvant *ngIf="texteImage.imageAvant" [src]="texteImage.imageAvant" />
    <span #spanTexte *ngIf="texteImage._texte">{{ texteImage.texte }}</span>
    <img #imgApres *ngIf="texteImage.imageApres" [src]="texteImage.imageApres" />
`,
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
