import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';

export class KfCaseACocher extends KfEntrée {

    /** si vrai, la case est après sa légende */
    caseApres: boolean;

    constructor(nom: string,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, KfTypeDeComposant.caseacocher, texte, imageAvant, imageApres);
        this._valeur = null;
    }

    get texteImageAvant(): boolean {
        return this.texteImage && this.caseApres;
    }

    get texteImageApres(): boolean {
        return this.texteImage && !this.caseApres;
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
