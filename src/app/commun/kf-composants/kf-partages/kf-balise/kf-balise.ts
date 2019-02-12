import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfClasseDefs } from '../../kf-partages/kf-classe-defs';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfBalise {
    baliseHTML: KfTypeDeBaliseHTML;

    private _classeDefs: KfClasseDefs;

    set classeDefs(classeDefs: KfClasseDefs) {
        this._classeDefs = classeDefs;
    }

    get classe(): string {
        if (this._classeDefs) {
            return this._classeDefs.classe;
        }
    }

    private _style: { [keys: string]: any };

    set style(style: { [keys: string]: any }) {
        if (style) {
            this._style = style;
        }
    }

    get style(): { [keys: string]: any } {
        return this._style;
    }

    private _contenuPhrase: KfContenuPhrase;

    set contenuPhrase(contenuPhrase: KfContenuPhrase) {
        this._contenuPhrase = contenuPhrase;
    }

    get contenuPhrase(): KfContenuPhrase {
        return this._contenuPhrase;
    }

    private _contenuBalise: KfBalise;

    set contenuBalise(contenuBalise: KfBalise) {
        this._contenuBalise = contenuBalise;
    }

    get contenuBalise(): KfBalise {
        return this._contenuBalise;
    }

    private _contenuTexte: string;

    set contenuTexte(contenuTexte: string) {
        this._contenuTexte = contenuTexte;
    }

    get contenuTexte(): string {
        return this._contenuTexte;
    }

    afterViewInit: (htmlElement: HTMLElement) => void;

}
