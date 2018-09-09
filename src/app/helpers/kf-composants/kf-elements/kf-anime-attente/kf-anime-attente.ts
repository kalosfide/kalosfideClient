import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDeComposant } from '../../kf-composants-types';

// affiche un texte et une animation pour indiquer qu'on attend
// états: visible ou invisible
// avec component dépendant de visible
export abstract class KfAnimeAttente extends KfElement {
    enCours: boolean;

    constructor(nom: string, type: KfTypeDeComposant) {
        super(nom, type);
    }
    abstract commence();
    abstract finit();
}

