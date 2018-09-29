import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant } from './kf-composant';

/**
 * KfElement
 * composant sans contenus et sans valeur
 */
export abstract class KfElement extends KfComposant {
    constructor(nom: string, typeDeComposant: KfTypeDeComposant,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        super(nom, typeDeComposant, texte, imageAvant, imageApres);
    }

    ajoute(composant: KfComposant) {
        throw Error('On ne peut pas ajouter de sous-composants à un compoant de ce type: ' + this.typeDeComposant);
    }

}
