import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

export class KfUlComposant extends KfComposant {
    private _gereCssLi: KfGèreCss;
    private _nAffichePasLesInvisibles: boolean;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.ul);
    }

    get gereCssLi(): KfGèreCss {
        if (!this._gereCssLi) {
            this._gereCssLi = new KfGèreCss();
        }
        return this._gereCssLi;
    }

    get nAffichePasLesInvisibles(): boolean {
        return this._nAffichePasLesInvisibles;
    }
    set nAffichePasLesInvisibles(nAffichePasLesInvisibles: boolean) {
        this._nAffichePasLesInvisibles = nAffichePasLesInvisibles;
    }

    get classeLi(): KfNgClasse {
        if (this._gereCssLi) {
            return this._gereCssLi.classe;
        }
    }
    get styleLi(): KfNgStyle {
        if (this._gereCssLi) {
            return this._gereCssLi.style;
        }
    }

    get contenusAAfficher(): KfComposant[] {
        return this.contenus.filter(c => c.visible);
    }

}
