/**
 * contient les informations sur une page atteignable par une route
 * pour figurer dans l'historique, la page doit avoir un:
 *  static _pageDef: PageDef;
 */
export class PageDef {
    /**
     * segment de route menant à la page
     */
    urlSegment: string;
    /**
     * texte des liens conduisant à la page
     */
    lien?: string;
    /**
     * texte à afficher dans l'onglet et l'historique du navigateur
     */
    title?: string;
    /**
     * texte à afficher en tête du template
     */
    titre?: string;
}
