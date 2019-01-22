import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant } from './kf-composant';
import { FormControl } from '@angular/forms';
import { KfComposantGereValeur } from './kf-composant-gere-valeur';
import { KfTexteDef, ValeurTexteDef } from '../kf-partages/kf-texte-def';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';

export type KfValeurEntrée = boolean | string | number | Date | null;

/**
 * KfEntrée
 * composant avec valeur, sans contenus avec valeur
 */
export abstract class KfEntrée extends KfComposant {

    _valeur: KfValeurEntrée;
    private _lectureSeule: boolean;
    private _lectureSeuleFnc: () => boolean;
    private _texteRemplissageDef: KfTexteDef;
    private _etiquetteAide: KfEtiquette;

    constructor(nom: string, typeDeComposant: KfTypeDeComposant,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, typeDeComposant, texte, imageAvant, imageApres);
        this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecEntree);
    }

    litValeur(): KfValeurEntrée {
        if (this.formControl) {
            return this.formControl.value;
        }
        if (this.estRacine) {
            return this.gereValeur.valeur;
        } else {
            return this.valeurDansParent;
        }
    }
    fixeValeur(valeur: KfValeurEntrée) {
        if (this.formControl) {
            this.formControl.setValue(valeur);
        } else {
            if (this.estRacine) {
                this._valeur = valeur;
            } else {
                this.valeurDansParent = valeur;
            }
        }
    }

    aPourValeur(valeur: KfValeurEntrée): boolean {
        return valeur === this.litValeur();
    }

    // INTERFACE

    get formControl(): FormControl {
        return this.abstractControl as FormControl;
    }

    /**
     *  méthodes pour fixer la façon de déterminer lectureSeule
     */
    set lectureSeule(lectureSeule: boolean) {
        this._lectureSeule = lectureSeule;
    }
    set lectureSeuleFnc(lectureSeuleFnc: () => boolean) {
        this._lectureSeuleFnc = lectureSeuleFnc;
    }
    /**
     * permet d'affecter l'attribut readonly au DOM element
     */
    get lectureSeule(): boolean {
        return (this._lectureSeuleFnc) ? this._lectureSeuleFnc() : this._lectureSeule;
    }

    /**
     *  méthodes pour fixer l'attribut placeholder
     */
    set texteRemplissage(texte: string) {
        this._texteRemplissageDef = texte;
    }
    set texteRemplissageFnc(texteFnc: () => string) {
        this._texteRemplissageDef = texteFnc;
    }
    /**
     * permet d'affecter l'attribut placeholder au DOM element
     */
    get texteRemplissage(): string {
        if (this._texteRemplissageDef) {
            return ValeurTexteDef(this._texteRemplissageDef);
        }
        return '';
    }

    /**
     *  méthodes pour fixer l'attribut placeholder
     */
    set texteAide(etiquette: KfEtiquette) {
        this._etiquetteAide = etiquette;
    }
    /**
     * permet d'affecter l'attribut placeholder au DOM element
     */
    get texteAide(): KfEtiquette {
        return this._etiquetteAide;
    }

}
