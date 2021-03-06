import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { KfTypeBaliseConteneur } from '../../kf-partages/kf-balises-html';

export class KfTexte extends KfElement {
    private _texteDef: KfTexteDef;

    /**
     * balises Html à ajouter dans le template autour de la partie rendant le composant
     * doivent être fixées avant d'ajouter le composant à son parent
     */
    _balisesAAjouter: KfTypeDeBaliseHTML[];

    constructor(nom: string, texteDef: KfTexteDef) {
        super(nom, KfTypeDeComposant.texte);
        this._texteDef = texteDef;
    }

    get texte(): string {
        if (this._texteDef !== undefined) {
            return ValeurTexteDef(this._texteDef);
        }
    }
    fixeTexte(texte: KfTexteDef) {
        this._texteDef = texte;
    }

    get balisesAAjouter(): KfTypeDeBaliseHTML[] {
        if (!this._balisesAAjouter && this.avecClassesOuStyle) {
            return [KfTypeDeBaliseHTML.span];
        }
        return this._balisesAAjouter;
    }

    set balisesAAjouter(balisesAAjouter: KfTypeDeBaliseHTML[]) {
        this._balisesAAjouter = balisesAAjouter;
    }
}
