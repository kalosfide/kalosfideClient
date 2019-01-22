import { KfTypeDeComposant, KfTypeDeBouton } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';

export class KfBouton extends KfElement {
    typeDeBouton: KfTypeDeBouton;

    constructor(nom: string,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, KfTypeDeComposant.bouton, texte, imageAvant, imageApres);
        this.typeDeBouton = KfTypeDeBouton.bouton;
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);
        this.ajouteClasseDef('kf-bouton btn');
    }

    buttonType(typeDeBouton: KfTypeDeBouton) {
        switch (typeDeBouton) {
            case KfTypeDeBouton.bouton:
                return 'button';
            case KfTypeDeBouton.retablir:
            case KfTypeDeBouton.annuler:
                return 'reset';
            case KfTypeDeBouton.soumettre:
                return 'submit';
            default:
                break;
        }
    }

}
