import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { FormGroup } from '@angular/forms';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfDivTable, KfDivTableLigne } from './kf-div-table';
import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';

export class KfGroupe extends KfComposant {
    /**
     * doit être fixée avant quandTousAjoutés
     * n'aura un effet que si le groupe est racine et avec valeur
     */
    private _sauveQuandChange: boolean;
    get sauveQuandChange(): boolean {
        if (this.estRacineV) {
            return this._sauveQuandChange;
        }
    }
    /**
     * doit être fixée avant quandTousAjoutés
     * n'aura un effet que si le groupe est racine et avec valeur
     */
    set sauveQuandChange(sauveQuandChange: boolean) {
        if (this.estRacineV) {
            this._sauveQuandChange = sauveQuandChange;
        }
    }

    /**
     * si formulaire et vrai, ajoute l'affichage des erreurs
     */
    private _avecInvalidFeedback: boolean;
    get avecInvalidFeedback(): boolean {
        if (this.estRacineV) {
            return this._avecInvalidFeedback;
        }
        if (this.parent) {
            return this.parent.avecInvalidFeedback;
        }
    }
    set avecInvalidFeedback(avecInvalidFeedback: boolean) {
        this._avecInvalidFeedback = avecInvalidFeedback;
    }

    /**
     * si formulaire à soumettre et vrai, autorise la soumission si valid ET si dirty
     * true pour les editions
     */
    private _neSoumetPasSiPristine: boolean;
    get neSoumetPasSiPristine(): boolean {
        return this._neSoumetPasSiPristine;
    }
    set neSoumetPasSiPristine(neSoumetPasSiPristine: boolean) {
        this._neSoumetPasSiPristine = neSoumetPasSiPristine;
    }

    /**
     * si existe, gère le css d'une div créée autour des contenus
     */
    private _gèreCssSousDiv: KfGèreCss;

    private _masqué: boolean;
    legende: KfEtiquette;

    private _divTable: KfDivTable;
    private _divLigne: KfDivTableLigne;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.groupe);
    }

    créeGereValeur() {
        this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecGroupe);
    }

    rétablitFormulaire() {
        this.gereValeur.rétablit(this.valeur);
        this.formGroup.reset(this.valeur);
    }

    peutSoumettre(): boolean {
        return this.formGroup && (!(this.neSoumetPasSiPristine && this.formGroup.pristine) && this.formGroup.valid);
    }

    soumetFormulaire() {
        if (!this.sauveQuandChange) {
            this.valeur = this.formGroup.value;
            this.formGroup.reset(this.valeur);
        }
    }

    /**
     * crée le gestionnaire css d'une div à ajouter autour des contenus
     */
    contenusDansDiv(classe: string) {
        this._gèreCssSousDiv = new KfGèreCss();
        this._gèreCssSousDiv.ajouteClasseDef(classe);
    }
    get classeSousDiv(): KfNgClasse {
        if (this._gèreCssSousDiv) {
            return this._gèreCssSousDiv.classe;
        }
    }

    get divTable(): KfDivTable {
        return this._divTable;
    }
    créeDivTable() {
        this._divTable = new KfDivTable();
    }

    get divLigne(): KfDivTableLigne {
        return this._divLigne;
    }
    créeDivLigne() {
        this._divLigne = new KfDivTableLigne();
    }

    masquable(masqueInitial: boolean) {
        this._masqué = masqueInitial;
    }

    get estMasquable(): boolean {
        return this._masqué !== undefined;
    }

    get masque(): boolean {
        return this._masqué === true;
    }

    basculeMasque() {
        this._masqué = !this._masqué;
    }

    get valeur(): any {
        if (this.gereValeur) {
            return this.gereValeur.valeur;
        }
    }
    set valeur(valeur: any) {
        if (this.gereValeur) {
            this.gereValeur.valeur = valeur;
        }
    }

    /**
     * fixe la valeur des contenus à partir des champs de même nom du paramètre
     * @param valeur peut contenir des champs qui ne correspondent pas aux contenus
     */
    fixeValeur(valeur: any) {
        this.contenus.forEach(c => {
            if (c.estEntree) {
                c.gereValeur.valeur = valeur[c.nom];
            }
        });
    }

    get formGroup(): FormGroup {
        return this.abstractControl as FormGroup;
    }

    /**
     */
    avecUnSeulContenuVisible(fncIndexSeulVisible: (() => number)) {
        this.gereVisible.avecUnSeulContenuVisible(() => this.contenus, fncIndexSeulVisible);
    }

    // FOCUS
    prendLeFocus(): boolean {
        if (this.gereHtml.prendLeFocus()) {
            return true;
        }
        return !!this.contenus.find(c => c.prendLeFocus());
    }

}
