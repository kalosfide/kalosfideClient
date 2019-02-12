import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfTexteDef } from '../kf-partages/kf-texte-def';

export class KfLiComposant extends KfComposant {
    constructor(nom: string) {
        super(nom, KfTypeDeComposant.li);
    }

}
