import { KfTypeDeComposant } from '../kf-composants-types';
import { KfComposant } from '../kf-composant/kf-composant';

export enum KfTypeDeSousMenu {
    etiquette = 'etiquette',
    bouton = 'bouton',
    lien = 'lien',
    special = 'special'
}

export interface KfDefinitionDeMenu {
    /** identifiant de l'item */
    id: any;
    /** type de sélecteur */
    type: KfTypeDeSousMenu;
    /** selecteur doit être défini si type est special  */
    selecteur?: KfComposant;
    /** pour construire le sélecteur */
    texte?: string;
    imageAvant?: string;
    imageApres?: string;
    /** pour pouvoir affecter la classe kf-choisi */
    peutEtreChoisi?: boolean;
    /** title de l'element (survol) */
    titleHtml?: string;
    /** pour rendre le lien inactif */
    inactivitéFnc?: () => boolean;
}

export enum KfMenuDirection {
    horizontal = 'kf-menu-horizontal',
    vertical = 'kf-menu-vertical',
}
