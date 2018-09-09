import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée } from '../../kf-composant/kf-entree';

export class KfCaseACocher extends KfEntrée {

    /** si vrai, la case est après sa légende */
    caseAprés: boolean;

    constructor(nom: string,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        super(nom, KfTypeDeComposant.caseacocher, texte, imageAvant, imageApres);
        this._valeur = null;
    }

    get texteImageAvant(): boolean {
        return this.texteImage && !this.caseAprés;
    }

    get texteImageApres(): boolean {
        return this.texteImage && this.caseAprés;
    }

    get valeur(): boolean {
        return this.gereValeur.valeur;
    }
    set valeur(valeur: boolean) {
        this.fixeValeur(valeur);
    }

    // données
    depuisForm() {
        this.valeur = this.formControl.value;
    }
    versForm() {
        this.formControl.setValue(this.valeur);
    }
}
