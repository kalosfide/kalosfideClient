import { KfTypeDeComposant, KfTypeDeValeur, KfTypeDeBaliseDEtiquette } from '../../kf-composants-types';
import { KfTexteImage } from '../../kf-partages/kf-texte-image/kf-texte-image';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';

export class KfEtiquette extends KfElement {
    baliseHTML: KfTypeDeBaliseDEtiquette;

    constructor(nom: string,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, KfTypeDeComposant.etiquette, texte, imageAvant, imageApres);
        this.baliseHTML = KfTypeDeBaliseDEtiquette.span;
    }

}
