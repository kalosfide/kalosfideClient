import { KfTexteDef, ValeurTexteDef } from '../kf-texte-def';
import { KfImageDef } from '../kf-image-def/kf-image-def';
import { ValeurNombreDef, KfNombreDef } from '../kf-nombre-def';

export class KfTexteImage {

    /**
     * texte de l'element ou de son label (facultatif)
     */
    private _texte: KfTexteDef;
    /**
     * image avant le texte de l'element ou de son label (facultatif)
     */
    private _imageAvant: KfImageDef;
    /**
     * image avant le texte de l'element ou de son label (facultatif)
     */
    private _imageApres: KfImageDef;
    /**
     * date à afficher à la place du texte (facultatif)
     */
    private _date: Date;

    enfantsDeVue: { [key: string]: HTMLElement };

    constructor(
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        this._texte = texte;
        if (imageAvant) {
            this._imageAvant = new KfImageDef(imageAvant);
        }
        if (imageApres) {
            this._imageApres = new KfImageDef(imageApres);
        }
    }

    /**
     * retourne le texte de l'element ou de son label (facultatif)
     */
    get texte(): string {
        if (this._texte) {
            return ValeurTexteDef(this._texte);
        }
    }
    /**
     * fixe le texte de l'element ou de son label (facultatif)
     */
    fixeTexte(texte: KfTexteDef) {
        this._texte = texte;
    }
    /**
     * retourne le texte de l'element ou de son label (facultatif)
     */
    get date(): Date {
        return this._date;
    }
    /**
     * fixe le texte de l'element ou de son label (facultatif)
     */
    fixeDate(date: Date) {
        this._date = date;
    }
    /**
     * retourne l'image avant le texte de l'element ou de son label (facultatif)
     */
    get imageAvant(): KfImageDef {
        if (this._imageAvant) {
            const image = new KfImageDef(ValeurTexteDef(this._imageAvant.urlDef));
            if (this._imageAvant.largeurDef) {
                image.largeurDef = ValeurNombreDef(this._imageAvant.largeurDef);
            }
            if (this._imageAvant.hauteurDef) {
                image.hauteurDef = ValeurNombreDef(this._imageAvant.hauteurDef);
            }
            return image;
        }
    }
    /**
     * fixe l'image avant le texte de l'element ou de son label (facultatif)
     */
    fixeImageAvant(imageDef: KfImageDef) {
        this._imageAvant = imageDef;
    }
    fixeUrlImageAvant(url: KfTexteDef) {
        if (!this._imageAvant) {
            this._imageAvant = new KfImageDef(url);
        } else {
            this._imageAvant.urlDef = url;
        }
    }
    fixeDimensionsImageAvant(largeur?: KfNombreDef, hauteur?: KfNombreDef) {
        if (this._imageAvant) {
            this._imageAvant.largeurDef = largeur;
            this._imageAvant.hauteurDef = hauteur;
        }
    }
    /**
     * retourne l'image après le texte de l'element ou de son label (facultatif)
     */
    get imageApres(): KfImageDef {
        if (this._imageApres) {
            const image = new KfImageDef(ValeurTexteDef(this._imageApres.urlDef));
            if (this._imageApres.largeurDef) {
                image.largeurDef = ValeurNombreDef(this._imageApres.largeurDef);
            }
            if (this._imageApres.hauteurDef) {
                image.hauteurDef = ValeurNombreDef(this._imageApres.hauteurDef);
            }
            return image;
        }
    }
    /**
     * fixe l'image après le texte de l'element ou de son label (facultatif)
     */
    fixeImageApres(imageDef: KfImageDef) {
        this._imageApres = imageDef;
    }
    fixeUrlImageApres(url: KfTexteDef) {
        if (!this._imageApres) {
            this._imageApres = new KfImageDef(url);
        } else {
            this._imageApres.urlDef = url;
        }
    }
    fixeDimensionsImageApres(largeur?: KfNombreDef, hauteur?: KfNombreDef) {
        if (this._imageApres) {
            this._imageApres.largeurDef = largeur;
            this._imageApres.hauteurDef = hauteur;
        }
    }

}
