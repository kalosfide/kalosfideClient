import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfCaseACocher extends KfEntrée {

    /** si vrai, la case est après sa légende */
    caseApres: boolean;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.caseacocher);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this._valeur = null;
    }

    get contenuPhraseAvant(): boolean {
        return this.contenuPhrase && this.caseApres;
    }

    get contenuPhraseApres(): boolean {
        return this.contenuPhrase && !this.caseApres;
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
