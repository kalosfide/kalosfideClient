import { KfResultatAffichable } from './kf-resultat-affichable';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDeComposant } from '../../kf-composants-types';

export class KfAfficheResultat extends KfElement {
    resultat: KfResultatAffichable;

    enCours: boolean;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.afficheResultat);
    }

    commence() {
        this.resultat = undefined;
    }
    finit(resultat?: KfResultatAffichable) {
        this.resultat = resultat;
    }
}
