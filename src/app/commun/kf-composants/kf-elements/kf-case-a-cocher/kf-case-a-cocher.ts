import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';

export class KfCaseACocher extends KfEntrée {

    /**
     * gère la classe de la div vide d'alignement dans un formulaire horizontal si il y en a une
     */
    private _gèreClasseDivVide: KfGéreCss;

    /** si vrai, la case est après sa légende */
    caseApres: boolean;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.caseacocher);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.gereValeur.valeur = false;

        this.ajouteClasseDef(
            'form-check-input',
            { nom: 'position-static', active: () => !this.contenuPhrase },
            { nom: 'is-invalid', active: () => this.erreurs.length > 0 },
        );
        this.gèreClasseEntree.ajouteClasseDef(
            { nom: 'is-invalid', active: () => this.erreurs.length > 0 },
        );
        const estDansVueTable = () => this.estDansVueTable;
        this.gèreClasseEntree.ajouteClasseDef(
            'form-check',
            { nom: 'form-group', active: estDansVueTable },
        );
        this.gèreClasseLabel.ajouteClasseDef(
            'form-check-label',
        );
        this.gèreClasseLabel.invisibilitéFnc = estDansVueTable;
    }

    get avecLabelAvant(): boolean {
        return this.avecLabel && this.caseApres;
    }

    get avecLabelApres(): boolean {
        return this.contenuPhrase && !this.caseApres;
    }

    get valeur(): boolean {
        return this.gereValeur.valeur;
    }
    set valeur(valeur: boolean) {
        this.fixeValeur(valeur);
    }

    get classeDiv(): KfNgClasse {
        return this.gèreClasseDiv.classe;
    }

    /**
     * gère la classe css de la div vide d'alignement dans un formulaire horizontal si il y en a une
     */
    get gèreClasseDivVide() {
        if (!this._gèreClasseDivVide) {
            this._gèreClasseDivVide = new KfGéreCss();
        }
        return this._gèreClasseDivVide;
    }

    /**
     * retourne la classe de la div vide d'alignement dans un formulaire horizontal si il y en a une
     */
    get classeDivVide(): KfNgClasse {
        if (this._gèreClasseDivVide) {
            return this._gèreClasseDivVide.classe;
        }
    }

    // données
    depuisForm() {
        this.valeur = this.formControl.value;
    }
    versForm() {
        this.formControl.setValue(this.valeur);
    }
}
