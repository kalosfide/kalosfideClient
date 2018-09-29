import { KfTypeDeComposant, KfTypeDeValeur, KfTypeDeBaliseDEtiquette } from '../../kf-composants-types';
import { KfTexteImage } from '../../kf-partages/kf-texte-image';
import { KfElement } from '../../kf-composant/kf-element';

export class KfEtiquette extends KfElement {
    baliseHTML: KfTypeDeBaliseDEtiquette;

    constructor(nom: string,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        super(nom, KfTypeDeComposant.etiquette, texte, imageAvant, imageApres);
        this.baliseHTML = KfTypeDeBaliseDEtiquette.span;
    }

}
