import { KfTypeDeComposant, KfTypeDeBouton } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfBouton extends KfElement {
    typeDeBouton: KfTypeDeBouton;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.bouton);
        this.typeDeBouton = KfTypeDeBouton.bouton;
        this.contenuPhrase = new KfContenuPhrase(this, texte);
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
