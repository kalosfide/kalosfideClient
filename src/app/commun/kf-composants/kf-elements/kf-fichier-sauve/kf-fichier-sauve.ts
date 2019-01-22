import { KfTypeDeComposant, KfTypeDeValeur, KfTypeDeBaliseDEtiquette } from '../../kf-composants-types';
import { KfTexteImage } from '../../kf-partages/kf-texte-image/kf-texte-image';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents, KfEvenement, KfTypeDEvenement } from '../../kf-partages/kf-evenements';
import { KfSuperGroupe } from '../../kf-groupe/kf-super-groupe';
import { KfParametres } from '../../kf-composants-parametres';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';

export class KfFichierSauve extends KfElement {
    texteASauver: () => string;
    private _nomFichier: () => string;

    constructor(nom: string, texteASauver: () => string, nomFichier: () => string,
    texte?: KfTexteDef,
    imageAvant?: KfTexteDef,
    imageApres?: KfTexteDef
) {
        super(nom, KfTypeDeComposant.fichierSauve);
        this.texteASauver = texteASauver;
        this._nomFichier = nomFichier;
        if (texte || imageAvant || imageApres) {
            this.fixeTexte(texte);
            this.fixeUrlImageAvant(imageAvant);
            this.fixeUrlImageApres(imageApres);
        } else {
            this.fixeTexte(KfParametres.fichierParDefaut.texteSauve);
        }
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);
        this.ajouteClasseDef('kf-fichier kf-bouton');
    }

    get dataUrl(): string {
        return 'data:text/plain;base64,' + btoa(this.texteASauver());
    }

    get nomFichier(): string {
        let nomFichier = this._nomFichier();
        if (!nomFichier || nomFichier === '') {
            nomFichier = KfParametres.fichierParDefaut.nom + KfParametres.fichierParDefaut.extension;
        }
        return nomFichier;
    }

}
