import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { FANomIcone } from '../../kf-partages/kf-icone-def';
import { KfGèreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasseDef, KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../../kf-partages/kf-gere-css-style';
import { KfIconeTaille, KfIconeAnimation, KfIconeRotation, KfIconeSymétrie, KfIconePositionTexte } from './kf-icone-types';

export interface IKfIcone {
    gèreCss: KfGèreCss;
    nom: string;
    nomIcone: FANomIcone;
    largeurFixe: boolean;
    inverse: boolean;
    taille(valeur: KfIconeTaille): void;
    animation(type: KfIconeAnimation): void;
    rotation(valeur: KfIconeRotation): void;
    symétrie(nom: KfIconeSymétrie): void;
}

class KfIconeBase extends KfElement implements IKfIcone {
    private _nomIcone: FANomIcone;
    private _taille: string;
    private _animation: string;
    private _rotation: string;
    private _symétrie: string;
    largeurFixe: boolean;
    inverse: boolean;

    tailleCouche: 1 | 2;

    taillePolicePourCent: number;

    constructor(nom: string, nomIcone?: FANomIcone) {
        super(nom, KfTypeDeComposant.icone);
        this._nomIcone = nomIcone;
    }

    get gèreCss(): KfGèreCss {
        return this;
    }

    get nomIcone(): FANomIcone {
        return this._nomIcone;
    }
    set nomIcone(nomIcone: FANomIcone) {
        this._nomIcone = nomIcone;
    }

    taille(valeur: KfIconeTaille) {
        this._taille = typeof (valeur) === 'string' ? valeur : '' + valeur + 'x';
    }

    /**
     * englobe l'icone dans
     * @param pourCent pourcentage de la taille de police
     */
    taillePoliceRelative(pourCent: number) {

    }

    animation(type: KfIconeAnimation) {
        this._animation = type;
    }

    rotation(valeur: KfIconeRotation) {
        this._rotation = 'rotate-' + valeur;
    }

    symétrie(nom: KfIconeSymétrie) {
        this._symétrie = 'flip-' + nom;
    }

    get faClasse(): string {
        const faClasse: string[] = [''];
        faClasse.push('fa');
        faClasse.push('fa-' + this._nomIcone);
        if (this._taille) {
            faClasse.push('fa-' + this._taille);
        }
        if (this._animation) {
            faClasse.push('fa-' + this._animation);
        }
        if (this.inverse) {
            faClasse.push('fa-inverse');
        }
        if (this.largeurFixe) {
            faClasse.push('fa-fw');
        }
        if (this._symétrie) {
            faClasse.push('fa-' + this._symétrie);
        }
        if (this._rotation) {
            faClasse.push('fa-' + this._rotation);
        }
        if (this.tailleCouche) {
            faClasse.push('fa-stack-' + this.tailleCouche + 'x');
        }
        return faClasse.join(' ');
    }

}

export class KfIcone extends KfIconeBase {
    private _texteDef: KfTexteDef;
    private _gèreCssTexte: KfGèreCss;
    private _positionTexte: KfIconePositionTexte;

    private _couches: IKfIcone[];
    private _taillePile: string;

    private _gereCssFond: KfGèreCss;

    constructor(nom: string, nomIcone?: FANomIcone) {
        super(nom, nomIcone);
    }

    ajouteTexte(texteDef: KfTexteDef, position?: KfIconePositionTexte) {
        this._positionTexte = position ? position : 'droite';
        this._texteDef = texteDef;
        if (this._positionTexte === 'haut' || this._positionTexte === 'bas') {
            this.créeGèreCssFond();
            this.gèreCssFond.ajouteClasseDef('kf-texte-dans-icone-fond', 'kf-texte-dans-icone-' + this._positionTexte);
            this.créeGèreCssTexte();
            this.gèreCssTexte.ajouteClasseDef('kf-texte-dans-icone');
        }
    }

    texteAvecCss() {
        if (!this._gèreCssTexte) {
            this._gèreCssTexte = new KfGèreCss();
        }
    }

    get positionTexte(): KfIconePositionTexte {
        return this._positionTexte;
    }

    get texteDef(): KfTexteDef {
        return this._texteDef;
    }
    set texteDef(texteDef: KfTexteDef) {
        this._texteDef = texteDef;
    }

    get texte(): string {
        if (this._texteDef) {
            return ValeurTexteDef(this._texteDef);
        }
    }

    créeGèreCssTexte() {
        this._gèreCssTexte = new KfGèreCss();
    }

    get gèreCssTexte(): KfGèreCss {
        return this._gèreCssTexte;
    }

    get classeTexte(): KfNgClasse {
        if (this._gèreCssTexte) {
            return this._gèreCssTexte.classe;
        }
    }

    get styleTexte(): KfNgStyle {
        if (this._gèreCssTexte) {
            return this._gèreCssTexte.style;
        }
    }

    empile(nomBas: FANomIcone, tailleBas?: 1 | 2, nomHaut?: FANomIcone, tailleHaut?: 1 | 2): IKfIcone {
        this.nomIcone = nomBas;
        this.tailleCouche = tailleBas ? tailleBas : 1;
        this._couches = [this];
        let icone: KfIconeBase;
        if (nomHaut) {
            icone = new KfIconeBase('', nomHaut);
            icone.tailleCouche = tailleHaut ? tailleHaut : 1;
            this._couches = [this, icone];
        }
        return icone;
    }

    get couches(): IKfIcone[] {
        return this._couches;
    }

    taillePile(valeur: KfIconeTaille) {
        this._taillePile = typeof (valeur) === 'string' ? valeur : '' + valeur + 'x';
    }

    get faClassePile(): string {
        const faClasse: string[] = [''];
        faClasse.push('fa-stack');
        if (this._taillePile) {
            faClasse.push('fa-' + this._taillePile);
        }
        return faClasse.join(' ');
    }

    créeGèreCssFond() {
        this._gereCssFond = new KfGèreCss();
    }

    get gèreCssFond(): KfGèreCss {
        return this._gereCssFond;
    }

    get avecFond(): boolean {
        return !!this._gereCssFond;
    }

    get classeFond(): KfNgClasse {
        if (this._gereCssFond) {
            return this._gereCssFond.classe;
        }
    }

    get styleFond(): KfNgStyle {
        if (this._gereCssFond) {
            return this._gereCssFond.style;
        }
    }

    get fondVisible(): boolean {
        if (this._gereCssFond) {
            return this._gereCssFond.visible;
        }
    }
    set fondVisible(visible: boolean) {
        if (!this._gereCssFond) {
            this._gereCssFond = new KfGèreCss();
        }
        this._gereCssFond.visible = visible;
    }

}
