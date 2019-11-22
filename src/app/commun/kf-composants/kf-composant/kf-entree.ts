import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant } from './kf-composant';
import { FormControl } from '@angular/forms';
import { KfComposantGereValeur } from './kf-composant-gere-valeur';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { KfIcone } from '../kf-elements/kf-icone/kf-icone';

export type KfValeurEntrée = boolean | string | number | Date | null;

/**
 * KfEntrée
 * composant avec valeur, sans contenus avec valeur
 */
export abstract class KfEntrée extends KfComposant {

    private _lectureSeule: boolean;
    private _lectureSeuleFnc: () => boolean;

    /**
     * pour afficher au dessous du composant
     */
    private _etiquetteAide: KfEtiquette;

    /**
     * classe de la div englobante du template
     */
    private _gèreClasseDiv: KfGèreCss;
    /**
     * classe du label du composant
     */
    private _gèreClasseLabel: KfGèreCss;
    /**
     * classe de la div contenant le composant si définie
     */
    private _gèreClasseEntree: KfGèreCss;
    iconeSurvol: KfIcone;

    constructor(nom: string, type: KfTypeDeComposant) {
        super(nom, type);
        this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecEntree);
    }

    protected litValeur(): KfValeurEntrée {
        return this.gereValeur.valeur;
    }
    protected fixeValeur(valeur: KfValeurEntrée) {
        this.gereValeur.valeur = valeur;
    }

    aPourValeur(valeur: KfValeurEntrée): boolean {
        return valeur === this.gereValeur.valeur;
    }

    // INTERFACE
    // le template comprend:
    //  un div englobante si _classeDiv est défini
    //      ou un label si le ContenuPhrase n'est pas vide (input)
    //      ou un legend si le ContenuPhrase n'est pas vide (listeDeroulante)
    //      ou un div vide si _classDivVide est défini (case à cocher pour aligner en colonne)
    //      un div si classeEntree est défini
    //          l'entrée
    //      fin div
    //      _etiquetteAide si défini
    //      un div pour les erreurs si avecInvalidFeedback
    // fin div

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
     * fixe l'étiquette d'aide à afficher au dessous du composant
     */
    set texteAide(etiquette: KfEtiquette) {
        this._etiquetteAide = etiquette;
    }
    /**
     * retourne l'étiquette d'aide à afficher au dessous du composant
     */
    get texteAide(): KfEtiquette {
        return this._etiquetteAide;
    }

    get avecLabel(): boolean {
        return this.contenuPhrase && this.contenuPhrase.contenus.length > 0;
    }

    /**
     * gère la classe css de la div englobant le template
     */
    get gèreClasseDiv(): KfGèreCss {
        if (!this._gèreClasseDiv) {
            this._gèreClasseDiv = new KfGèreCss();
            this._gèreClasseDiv.suitLaVisiblité(this);
        }
        return this._gèreClasseDiv;
    }

    /**
     * gère la classe css du label du composant
     */
    get gèreClasseLabel() {
        if (!this._gèreClasseLabel) {
            this._gèreClasseLabel = new KfGèreCss();
        }
        return this._gèreClasseLabel;
    }

    /**
     * fixe la classe css de la div contenant le composant
     */
    get gèreClasseEntree(): KfGèreCss {
        if (!this._gèreClasseEntree) {
            this._gèreClasseEntree = new KfGèreCss();
            this._gèreClasseEntree.suitLaVisiblité(this);
        }
        return this._gèreClasseEntree;
    }
    ajouteIconeSurvol(icone: KfIcone) {
        this.gèreClasseEntree.ajouteClasseDef('avecSurvol');
        this.gèreClasseEntree.fixeStyleDef('position', 'relative');
        this.iconeSurvol = icone;
    }

    /**
     * retourne la classe css de la div englobant le template, undefined si dans vueTable
     */
    get classeDiv(): KfNgClasse {
        if (this._gèreClasseDiv && !this.estDansVueTable) {
            return this._gèreClasseDiv.classe;
        }
    }

    /**
     * retourne la classe css du label du composant, undefined si dans vueTable
     */
    get classeLabel(): KfNgClasse {
        if (this._gèreClasseLabel && !this.estDansVueTable) {
            return this._gèreClasseLabel.classe;
        }
    }

    /**
     * retourne la classe css de la div contenant le composant
     */
    get classeEntree(): KfNgClasse {
        if (this._gèreClasseEntree) {
            return this._gèreClasseEntree.classe;
        }
    }
}
