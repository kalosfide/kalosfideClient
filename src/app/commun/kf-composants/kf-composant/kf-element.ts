import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant } from './kf-composant';
import { KfTexteDef } from '../kf-partages/kf-texte-def';

/**
 * KfElement
 * composant sans contenus et sans valeur
 */
export abstract class KfElement extends KfComposant {
    constructor(nom: string, typeDeComposant: KfTypeDeComposant,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, typeDeComposant, texte, imageAvant, imageApres);
    }

}
