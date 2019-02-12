import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfBouton } from '../kf-bouton/kf-bouton';
import { KfEtiquette } from '../kf-etiquette/kf-etiquette';

type TypePlacement =  'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' |
    'left' | 'left-top' | 'left-bottom' | 'right' | 'right-top' | 'right-bottom';

export class KfNgbPopover extends KfElement {
    autoClose: boolean | 'inside' | 'outside';
    placement: TypePlacement | TypePlacement[];
    ouvert: boolean;

    // pour la classe et le contenuPhrase
    bouton: KfBouton;

    popTitre: KfEtiquette;
    popContenus: KfEtiquette[];

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.ngbPopover);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.bouton = new KfBouton('');
        this.bouton.ajouteClasseDef('btn');
    }

    ajouteTitre(titre: KfEtiquette) {
        this.popTitre = titre;
    }
    ajouteContenu(contenu: KfEtiquette) {
        if (this.popContenus) {
            this.popContenus.push(contenu);
        } else {
            this.popContenus = [contenu];
        }
    }
}
