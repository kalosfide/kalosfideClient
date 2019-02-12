import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfLiComposant } from './kf-li-composant';

export class KfUlComposant extends KfComposant {
    constructor(nom: string) {
        super(nom, KfTypeDeComposant.ul);
    }

    ajoute(composant: KfComposant) {
        if (composant.typeDeComposant !== KfTypeDeComposant.li) {
            throw Error(`On ne peut ajouter que des types ${KfTypeDeComposant.li} à un compoant de ce type: ${this.typeDeComposant}`);
        }
        this.noeud.Ajoute(composant.noeud);
    }

    get contenus(): KfLiComposant[] {
        return this.enfants.map(composant => composant as KfLiComposant);
    }

}
