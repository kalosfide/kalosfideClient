import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfBouton } from '../kf-bouton/kf-bouton';
import { KfLien } from '../kf-lien/kf-lien';

type TypePlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' |
    'left' | 'left-top' | 'left-bottom' | 'right' | 'right-top' | 'right-bottom';

export class KfNgbDropdown extends KfElement {
    autoClose: boolean | 'inside' | 'outside';
    placement: TypePlacement | TypePlacement[];
    ouvert: boolean;

    // pour la classe et le contenu phrasé
    bouton: KfBouton;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.ngbDropdown);
        this.bouton = new KfBouton('', texte);
        this.bouton.ajouteClasseDef('btn');
    }
}

export class KfNgbDropdownGroup extends KfElement {
    constructor(nom: string) {
        super(nom, KfTypeDeComposant.ngbDropdownGroup);
    }

    ajoute(item: KfLien) {
        this.noeud.Ajoute(item.noeud);
        item.ajouteClasseDef('dropdown-item');
    }
}
