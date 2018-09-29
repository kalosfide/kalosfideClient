import { KfTypeDeComposant, KfTypeDeBouton } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';

export class KfBouton extends KfElement {
    typeDeBouton: KfTypeDeBouton;

    constructor(nom: string,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        super(nom, KfTypeDeComposant.bouton, texte, imageAvant, imageApres);
        this.typeDeBouton = KfTypeDeBouton.bouton;
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);
        this.ajouteClasse('kf-bouton btn');
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
