import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant } from './kf-composant';
import { AbstractControl, FormControl } from '@angular/forms';
import { KfComposantGereValeur } from './kf-composant-gere-valeur';

export type KfValeurEntrée = boolean | string | number | null;

/**
 * KfEntrée
 * composant avec valeur, sans contenus avec valeur
 */
export abstract class KfEntrée extends KfComposant {

    _valeur: KfValeurEntrée;

    constructor(nom: string, typeDeComposant: KfTypeDeComposant,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        super(nom, typeDeComposant, texte, imageAvant, imageApres);
        this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecEntree);
    }

    ajoute(composant: KfComposant) {
        throw Error('On ne peut pas ajouter de sous-composants à un compoant de ce type: ' + this.typeDeComposant);
    }

    private créeFormControl(): FormControl {
        const formControl = new FormControl('');
        return formControl;
    }

    litValeur(): KfValeurEntrée {
        if (this.formControl) {
            return this.formControl.value;
        }
        if (this.estRacine) {
            return this._valeur;
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

}
