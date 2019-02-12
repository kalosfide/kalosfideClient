import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';

export class KfNav extends KfComposant {

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.nav);
        this.ajouteClasseDef('nav');
    }

}
