import { KfTypeDeComposant, KfTypeDeValeur } from '../../kf-composants-types';
import { KfTexteImage } from '../../kf-partages/kf-texte-image/kf-texte-image';
import { Liste, TypeDEvenementDeListe, EvenementDeListe, DétailAjoute, DétailSupprime, DétailDéplace } from '../../../outils/liste';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';

export interface OptionDeListe { texte: string; valeur: string | number; estObject: boolean; }

export class KfListeDeroulante extends KfEntrée {
    // données
    private liste: Liste;
    /** pour afficher l'item */
    creeTexte: (item: any) => string;
    /** pour la valeur HTML de l'item */
    creeValeur: (item: any) => string | number;

    private _options: OptionDeListe[];
    multiple: boolean;

    estLiée: boolean;
    nullImpossible: boolean;

    constructor(nom: string,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, KfTypeDeComposant.listederoulante, texte, imageAvant, imageApres);
        this.liste = new Liste();
        this._valeur = null;
        this._options = [];
        this.estLiée = false;
    }

    lieAListe(liste: Liste, creeTexte?: (item: any) => string, creeValeur?: (item: any) => string | number) {
        this.liste = liste;
        this.prendAbonnements();
        this.creeTexte = creeTexte ? creeTexte : this._creeTexte;
        this.creeValeur = creeValeur;
        this.estLiée = true;
    }

    _creeTexte(item: any): string {
        if (typeof (item) === 'string') {
            return item;
        } else {
            if (typeof (item) === 'number') {
                return item.toString();
            }
        }
    }

    ajouteOption(objet: string | number, valeur?: string | number) {
        const texte = this._creeTexte(objet);
        this.liste.Ajoute({ texte: texte, valeur: valeur ? valeur : texte, estObject: false });
    }

    get selectElement(): HTMLSelectElement {
        return this.gereHtml.htmlElement as HTMLSelectElement;
    }

    litIndex(): number {
        return this.selectElement ? this.selectElement.selectedIndex : -1;
    }
    fixeIndex(index: number) {
        console.log('fixeIndex');
        if (this.selectElement && this.selectElement.selectedIndex !== index) {
            console.log('Indexfixé');
            this.selectElement.selectedIndex = index;
        }
    }

    valeurOption(index: number): any {
        if (index >= 0 && index < this.liste.Nb) {
            if (this._options) {
                return this._options[index].valeur;
            } else {
                const item = this.liste.Objet(index);
                if (this.estLiée) {
                    return (item as OptionDeListe).valeur;
                }
                if (this.creeValeur) {
                    return this.creeValeur(item);
                } else {
                    if (item.valeur) {
                        return item.valeur;
                    }
                }
            }
        }
        return null;
    }

    get valeurInitiale(): any {
        return this._valeur ? this._valeur : this.valeurOption(0);
    }

    optionNulle(): OptionDeListe {
        return {
            texte: '',
            valeur: null,
            estObject: false
        };
    }
    option(item: any): OptionDeListe {
        const option = { texte: null, valeur: null, estObject: false };
        option.texte = this.creeTexte(item);
        if (this.creeValeur) {
            option.estObject = true;
            option.valeur = this.creeValeur(item);
        } else {
            option.valeur = item;
        }
        if (!option.texte) {
            option.texte = 'option ' + (this.liste.IndexDe(item) + 1);
        }
        return option;
    }

    créeOptions(): OptionDeListe[] {
        if (this.estLiée) {
            this._options = this.liste.Objets.map(o => this.option(o));
        } else {
            this._options = this.liste.Objets.map(o => o as OptionDeListe);
        }
        if (!this.nullImpossible) {
            this._options.unshift(this.optionNulle());
        }
        return this._options;
    }

    get options(): OptionDeListe[] {
        return this.liste ? this.créeOptions() : this._options;
    }

    get contenus(): any[] {
        return this.liste ? this.liste.Objets : this._options;
    }
    // DONNEES

    _ajouteAValeurParent(valeurParent: any) {
        valeurParent[this.nom] = this._valeur;
    }

    /**
     * valeur: any
     */
    get valeur(): any {
        return this.litValeur();
    }
    set valeur(valeur: any) {
        this.fixeValeur(valeur);
        this.liste.ObjetEnCours = valeur;
    }

    depuisForm() {
        this._valeur = this.formControl.value;
    }
    versForm() {
        this.formControl.setValue(this.valeur);
    }

    // EVENEMENTS DE LISTE
    prendAbonnements() {
        this.liste.Abonne(this, TypeDEvenementDeListe.ajoute,
            (e: EvenementDeListe) => {
                const d = e.data as DétailAjoute;
                this.quandAjout(d.Objet, d.Index);
            }
        );
        this.liste.Abonne(this, TypeDEvenementDeListe.supprime,
            (e: EvenementDeListe) => {
                const d = e.data as DétailSupprime;
                this.quandSupprime(d.objet, d.Index);
            }
        );
        this.liste.Abonne(this, TypeDEvenementDeListe.deplace,
            (e: EvenementDeListe) => {
                const d = e.data as DétailDéplace;
                this.quandDeplace(d.IndexAvant, d.IndexAprès);
            }
        );
        this.liste.Abonne(this, TypeDEvenementDeListe.vide, (e: EvenementDeListe) => this.quandVide());
        this.liste.Abonne(this, TypeDEvenementDeListe.remplit, (e: EvenementDeListe) => this.quandRemplit());
    }

    quandAjout(objet: any, index: number) {
        this.options.splice(index, 0, this.option(objet));
    }

    quandSupprime(objet: any, index: number) {
        const valeur = this.creeValeur ? this.creeValeur(objet) : objet;
        if (this.formControl && this.formControl.value === valeur) {
            this.formControl.setValue(null);
        }
        this._options.splice(index, 1);
    }

    quandDeplace(indexAvant: number, indexApres: number) {
        const option = this._options.splice(indexAvant, 1)[0];
        this._options.splice(indexApres, 0, option);
    }

    quandRemplit() {
        this.créeOptions();
    }

    quandVide() {
        this._options = [];
    }

}
