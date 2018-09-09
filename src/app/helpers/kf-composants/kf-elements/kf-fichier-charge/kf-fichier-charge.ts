import { KfTypeDeComposant, KfTypeDeValeur, KfTypeDeBaliseDEtiquette } from '../../kf-composants-types';
import { KfTexteImage } from '../../kf-partages/kf-texte-image';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfSuperGroupe } from '../../kf-groupe/kf-super-groupe';
import { KfParametres } from '../../kf-composants-parametres';
import { KfFichier } from '../kf-fichier/kf-fichier';

export interface KfResultatFichierCharge {
    file: File;
    erreur?: any;
    texte?: string;
}

export class KfFichierCharge extends KfElement {

    fichier: KfFichier;

    superGroupe: KfSuperGroupe;
    decodeSelecteur: (selecteur: any) => KfSuperGroupe;

    /**
     * contient un KfFichier. Quand le KfFichier émet fichiersChoisis, lit le contenu du fichier
     * et vérifie qu'il permet d'affecter une valeur à un superGroupe.
     * Si oui, transforme fichiersChoisis en fichierCharge avec pour parametres un object de membres superGroupe et valeur
     * @param nom identifiant unique du composant dans le groupe parent
     * @param extension extension du fichier, si non défini: ParametresDesKfComposants.fichierParDefaut.extension
     * @param texte texte du bouton
     * @param imageAvant image du bouton
     * @param imageApres image du bouton
     */
    constructor(nom: string, extension?: string,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        super(nom, KfTypeDeComposant.fichierCharge);
        this.fichier = new KfFichier(nom + '_f', texte, imageAvant, imageApres);
        this.fichier.typesExtension.push( extension ? extension : KfParametres.fichierParDefaut.extension);
        this.fichier.multiple = false;
    }

}
