import { KfTypeDeComposant } from '../../kf-composants-types';
import { Liste, TypeDEvenementDeListe, EvenementDeListe, DétailAjoute, DétailSupprime, DétailDéplace } from '../../../outils/liste';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfTexte } from '../kf-texte/kf-texte';

export class KfOptionDeListe extends KfContenuPhrase {
    kfTexte: KfTexte;
    private _valeurDef: KfTexteDef | number;
    estObject: boolean;
    inactif?: boolean;

    constructor(texteDef?: KfTexteDef, valeurDef?: KfTexteDef | number) {
        super();
        if (texteDef) {
            this.kfTexte = new KfTexte('', texteDef);
            this.ajoute(this.kfTexte);
        }
        this._valeurDef = valeurDef;
    }

    get valeur(): string {
        if (this._valeurDef) {
            if (typeof (this._valeurDef) === 'number') {
                return '' + this._valeurDef;
            } else {
                return ValeurTexteDef(this._valeurDef);
            }
        }
    }
}

export interface IKfListeLiante {
    liste: Liste;
    créeTexte: (item: any) => KfTexteDef;
    créeValeur: (item: any) => string;
}

export class KfListeDeroulanteVieux extends KfEntrée {
    // liste d'objets any
    // données
    private liste: Liste;

    /** pour afficher l'item */
    private _créeTexte: (item: any) => KfTexteDef;
    /** pour la valeur HTML de l'item */
    private _créeValeur: (item: any) => string | number;

    private _options: KfOptionDeListe[];
    multiple: boolean;

    nullImpossible: boolean;

    private _option0: KfOptionDeListe;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.listederoulante);
        this._options = [];
        this.contenuPhrase = new KfContenuPhrase(this, texte);

        this.ajouteClasseDef(
            'form-control',
            { nom: 'position-static', active: () => !this.contenuPhrase }
        );
        const estDansVueTable = () => this.estDansVueTable;
        this.gèreClasseLabel.ajouteClasseDef(
            { nom: 'kf-invisible', active: estDansVueTable }
        );
    }

    ajouteOption(texte: KfTexteDef, valeur?: KfTexteDef | number): KfOptionDeListe {
        const option = new KfOptionDeListe(texte, valeur);
        this._options.push(option);
        return option;
    }

    optionNulle(): KfOptionDeListe {
        return null;
    }

    créeOption0(): KfContenuPhrase {
        this._option0 = new KfOptionDeListe();
        this.valeur = '';
        return this._option0;
    }

    get option0(): KfOptionDeListe {
        return this._option0;
    }

    get options(): KfOptionDeListe[] {
        return this._options;
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

    // DONNEES

    /**
     * valeur: any
     */
    get valeur(): any {
        return this.litValeur();
    }
    set valeur(valeur: any) {
        this.fixeValeur(valeur);
    }

    // LISTE LIEE

    lieAListe(liste: Liste, creeTexte?: (item: any) => string, creeValeur?: (item: any) => string | number) {
        this.liste = liste;

        this.liste.Abonne(this, TypeDEvenementDeListe.ajoute,
            (e: EvenementDeListe) => {
                const d = e.data as DétailAjoute;
                this._quandAjout(d.Objet, d.Index);
            }
        );
        this.liste.Abonne(this, TypeDEvenementDeListe.supprime,
            (e: EvenementDeListe) => {
                const d = e.data as DétailSupprime;
                this._quandSupprime(d.objet, d.Index);
            }
        );
        this.liste.Abonne(this, TypeDEvenementDeListe.deplace,
            (e: EvenementDeListe) => {
                const d = e.data as DétailDéplace;
                this._quandDeplace(d.IndexAvant, d.IndexAprès);
            }
        );
        this.liste.Abonne(this, TypeDEvenementDeListe.vide, () => this._quandVide());
        this.liste.Abonne(this, TypeDEvenementDeListe.remplit, () => this._quandRemplit());

        this._créeTexte = creeTexte;
        this._créeValeur = creeValeur;
    }

    private _créeOption(item: any): KfOptionDeListe {
        const option = new KfOptionDeListe(
            this._créeTexte ? this._créeTexte(item) : 'option ' + (this.liste.IndexDe(item) + 1),
            this._créeValeur ? this._créeValeur(item) : '');
        return option;
    }

    private _quandAjout(objet: any, index: number) {
        this.options.splice(index, 0, this._créeOption(objet));
    }

    private _quandSupprime(objet: any, index: number) {
        const valeur = this._créeValeur ? this._créeValeur(objet) : objet;
        if (this.formControl && this.formControl.value === valeur) {
            this.formControl.setValue(null);
        }
        this._options.splice(index, 1);
    }

    private _quandDeplace(indexAvant: number, indexApres: number) {
        const option = this._options.splice(indexAvant, 1)[0];
        this._options.splice(indexApres, 0, option);
    }

    private _quandRemplit() {
        this._options = this.liste.Objets.map(o => this._créeOption(o));
    }

    private _quandVide() {
        this._options = [];
    }

}
